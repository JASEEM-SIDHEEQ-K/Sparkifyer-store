import { useDispatch } from "react-redux";
import { updateCartQuantity, removeFromCart } from "../../features/cart/cartApi";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  // ─── Handlers ─────────────────────────────────────────
  const handleIncrease = () => {
    if (item.quantity >= item.stock) return;
    dispatch(updateCartQuantity(item.id, item.quantity + 1));
  };

  const handleDecrease = () => {
    if (item.quantity <= 1) return;
    dispatch(updateCartQuantity(item.id, item.quantity - 1));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  // ─── Discount ─────────────────────────────────────────
  const discount = item.originalPrice
    ? Math.round(
        ((item.originalPrice - item.price) / item.originalPrice) * 100
      )
    : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 shadow-sm">

      {/* ── Product Image ──────────────────────────────── */}
      <div className="flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-xl"
        />
      </div>

      {/* ── Product Info ───────────────────────────────── */}
      <div className="flex-1 flex flex-col gap-2">

        {/* Name + Remove */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">
            {item.name}
          </h3>
          <button
            onClick={handleRemove}
            className="text-slate-400 hover:text-red-500 transition text-lg flex-shrink-0"
          >
            ✕
          </button>
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

        {/* Quantity + Subtotal Row */}
        <div className="flex items-center justify-between">

          {/* Quantity Selector */}
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              −
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-slate-800 border-x border-slate-300">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={item.quantity >= item.stock}
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          {/* Subtotal */}
          <span className="text-sm font-bold text-blue-600">
            ${(item.price * item.quantity).toFixed(2)}
          </span>

        </div>

        {/* Stock Warning */}
        {item.quantity >= item.stock && (
          <p className="text-xs text-orange-400">
            ⚠ Max stock reached ({item.stock} available)
          </p>
        )}

      </div>
    </div>
  );
};

export default CartItem;