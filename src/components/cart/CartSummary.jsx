// src/components/cart/CartSummary.jsx

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectCartItems,
  selectCartTotal,
  selectCartSavings,
  selectCartCount,
} from "../../features/cart/cartSlice";

const CartSummary = () => {
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const savings = useSelector(selectCartSavings);
  const count = useSelector(selectCartCount);

  // ─── Free delivery threshold ──────────────────────────
  const FREE_DELIVERY = 50;
  const deliveryCharge = total >= FREE_DELIVERY ? 0 : 5.99;
  const amountForFreeDelivery = FREE_DELIVERY - total;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">

      {/* ── Header ──────────────────────────────────────── */}
      <h2 className="text-base font-bold text-slate-800">
        Order Summary
      </h2>

      {/* ── Free Delivery Progress ───────────────────────── */}
      {total < FREE_DELIVERY ? (
        <div className="bg-blue-50 rounded-xl p-3">
          <p className="text-xs text-blue-600 font-medium mb-2">
            Add ${amountForFreeDelivery.toFixed(2)} more for free delivery! 🚚
          </p>
          <div className="w-full bg-blue-100 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((total / FREE_DELIVERY) * 100, 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-green-50 rounded-xl p-3">
          <p className="text-xs text-green-600 font-medium">
            🎉 You got free delivery!
          </p>
        </div>
      )}

      {/* ── Price Breakdown ──────────────────────────────── */}
      <div className="flex flex-col gap-2 text-sm">

        {/* Items count */}
        <div className="flex justify-between text-slate-500">
          <span>Items ({count})</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Savings */}
        {savings > 0 && (
          <div className="flex justify-between text-green-500">
            <span>You save</span>
            <span>-${savings.toFixed(2)}</span>
          </div>
        )}

        {/* Delivery */}
        <div className="flex justify-between text-slate-500">
          <span>Delivery</span>
          <span>
            {deliveryCharge === 0 ? (
              <span className="text-green-500 font-medium">FREE</span>
            ) : (
              `$${deliveryCharge.toFixed(2)}`
            )}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 my-1" />

        {/* Total */}
        <div className="flex justify-between font-bold text-slate-800 text-base">
          <span>Total</span>
          <span>${(total + deliveryCharge).toFixed(2)}</span>
        </div>

      </div>

      {/* ── Checkout Button ──────────────────────────────── */}
      <button
        onClick={() => navigate("/checkout")}
        disabled={items.length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Proceed to Checkout →
      </button>

      {/* ── Continue Shopping ────────────────────────────── */}
      <button
        onClick={() => navigate("/products")}
        className="w-full border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium py-2.5 rounded-xl transition text-sm"
      >
        Continue Shopping
      </button>

    </div>
  );
};

export default CartSummary;