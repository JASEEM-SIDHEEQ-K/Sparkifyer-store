import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRemoveFromWishlist } from "../../features/wishlist/wishlistApi";
import { selectCartItems } from "../../features/cart/cartSlice";
import useAuth from "../../hooks/useAuth";
import api from "../../services/api";
import { addCartItem, updateCartItem } from "../../features/cart/cartSlice";

import { useState } from "react";
import { createSlug } from "../../utils/helpers";

const WishlistItem = ({ item }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { mutate: removeFromWishlist, isPending: isRemoving } =
    useRemoveFromWishlist();

  // ─── Check if already in cart ─────────────────────────
  const isInCart = cartItems.some(
    (cartItem) =>
      cartItem.productId === item.productId ||
      cartItem.productId === String(item.productId)
  );

  // ─── Discount ─────────────────────────────────────────
  const discount = item.originalPrice
    ? Math.round(
        ((item.originalPrice - item.price) / item.originalPrice) * 100
      )
    : 0;

  
  const handleRemove = () => {
    removeFromWishlist({
      wishlistItemId: item.id,
      userId: user?.id,
    });
  };

  
  const handleMoveToCart = async () => {
    try {
      setIsAddingToCart(true);

      const existingCartItem = cartItems.find(
        (cartItem) =>
          cartItem.productId === item.productId ||
          cartItem.productId === String(item.productId)
      );

      if (existingCartItem) {
        // ── Already in cart → update quantity ────────────
        const newQuantity = existingCartItem.quantity + 1;

        if (newQuantity > item.stock) {
          alert(`Only ${item.stock} items available!`);
          return;
        }

        await api.patch(`/cart/${existingCartItem.id}`, {
          quantity: newQuantity,
        });

        dispatch(
          updateCartItem({
            id: existingCartItem.id,
            quantity: newQuantity,
          })
        );

      } else {
        // ── Not in cart → add new item ───────────────────
        const newItem = {
          userId: user?.id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          image: item.image,
          quantity: 1,
          stock: item.stock,
        };

        const response = await api.post("/cart", newItem);
        dispatch(addCartItem(response.data));
      }

      // remove from wishlist after cart success
      removeFromWishlist({
        wishlistItemId: item.id,
        userId: user?.id,
      });

    } catch (error) {
      console.error("Move to cart failed:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // ─── Handle View Product ──────────────────────────────
  const handleViewProduct = () => {
    navigate(`/products/${item.productId}/${createSlug(item.name)}`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex gap-4">

      {/* ── Product Image ──────────────────────────────── */}
      <div
        className="flex-shrink-0 cursor-pointer"
        onClick={handleViewProduct}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-xl hover:opacity-90 transition"
        />
      </div>

      {/* ── Product Info ───────────────────────────────── */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">

        {/* Name + Remove */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-sm font-semibold text-slate-800 line-clamp-2 cursor-pointer hover:text-blue-600 transition"
            onClick={handleViewProduct}
          >
            {item.name}
          </h3>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-slate-400 hover:text-red-500 transition text-lg flex-shrink-0 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Category + Brand */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-600 font-medium">
            {item.category}
          </span>
          <span className="text-xs text-slate-300">•</span>
          <span className="text-xs text-slate-400">
            {item.brand}
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-slate-800">
            ${item.price}
          </span>
          {item.originalPrice && item.originalPrice > item.price && (
            <>
              <span className="text-xs text-slate-400 line-through">
                ${item.originalPrice}
              </span>
              <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                -{discount}%
              </span>
            </>
          )}
        </div>

        {/* Stock Status */}
        <p className={`text-xs ${
          item.stock > 10
            ? "text-green-500"
            : item.stock > 0
            ? "text-orange-400"
            : "text-red-500"
        }`}>
          {item.stock > 10
            ? "✓ In Stock"
            : item.stock > 0
            ? `⚠ Only ${item.stock} left`
            : "✗ Out of Stock"}
        </p>

        
        <div className="flex gap-2 mt-1">

          
          <button
            onClick={handleMoveToCart}
            disabled={item.stock === 0 || isAddingToCart || isRemoving}
            className={`flex-1 text-xs font-semibold py-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed
              ${isInCart
                ? "bg-green-50 text-green-600 border border-green-300 hover:bg-green-100"
                : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {isAddingToCart
              ? "Adding..."
              : isInCart
              ? "✓ Move to Cart"
              : "🛒 Move to Cart"}
          </button>

          
          <button
            onClick={handleViewProduct}
            className="flex-1 text-xs font-semibold py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 transition"
          >
            View Details
          </button>

        </div>

      </div>

    </div>
  );
};

export default WishlistItem;