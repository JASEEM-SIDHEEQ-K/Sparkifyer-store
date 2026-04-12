// src/pages/Cart.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart } from "../features/cart/cartApi";
import {
  selectCartItems,
  selectCartLoading,
  selectCartError,
  selectCartCount,
  selectCartTotalQuantity
} from "../features/cart/cartSlice";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import useAuth from "../hooks/useAuth";

const Cart = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const navigate = useNavigate()

  const items = useSelector(selectCartItems);
  const isLoading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const count = useSelector(selectCartCount);
  const quantity = useSelector(selectCartTotalQuantity);

  // ─── Fetch cart on mount ───────────────────────────────
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [user?.id, dispatch]);

  // ─── Loading State ─────────────────────────────────────
  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // ─── Error State ───────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-2">{error}</p>
          <button
            onClick={() => dispatch(fetchCart(user?.id))}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Page Header ───────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            🛒 My Cart
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {count > 0
              ? `${count} item${count > 1 ? "s" : ""} • ${quantity} quantity${quantity > 1 ? "ies" : ""}`
              : "Your cart is empty"}
          </p>
          <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition mb-6 font-medium"
            >
            <br/>
            ← Home
          </button>
        </div>

        {/* ── Empty Cart ────────────────────────────────── */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-6xl mb-4">🛒</p>
            <h2 className="text-xl font-bold text-slate-700 mb-2">
              Your cart is empty!
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Looks like you haven't added anything yet.
            </p>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (

          /* ── Cart Content ──────────────────────────────── */
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── Left → Cart Items ────────────────────── */}
            <div className="flex-1 flex flex-col gap-3">


              {/* Cart Items List */}
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="text-sm text-blue-600 hover:underline font-medium mt-2"
              >
                ← Continue Shopping
              </Link>

            </div>

            {/* ── Right → Order Summary ────────────────── */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <CartSummary />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;