// src/components/checkout/OrderSummary.jsx

import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  selectCartSavings,
  selectCartCount,
} from "../../features/cart/cartSlice";

const OrderSummary = () => {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const savings = useSelector(selectCartSavings);
  const count = useSelector(selectCartCount);

  // ─── Delivery charge ──────────────────────────────────
  const FREE_DELIVERY = 50;
  const deliveryCharge = total >= FREE_DELIVERY ? 0 : 5.99;
  const finalTotal = total + deliveryCharge;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">

      {/* ── Header ──────────────────────────────────────── */}
      <h2 className="text-base font-bold text-slate-800">
        🧾 Order Summary
      </h2>

      {/* ── Items List ───────────────────────────────────── */}
      <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3"
          >
            {/* Image */}
            <div className="flex-shrink-0 relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              {/* Quantity Badge */}
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {item.quantity}
              </span>
            </div>

            {/* Name + Price */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">
                {item.name}
              </p>
              <p className="text-xs text-slate-400">
                ${item.price} × {item.quantity}
              </p>
            </div>

            {/* Subtotal */}
            <span className="text-sm font-semibold text-slate-800 flex-shrink-0">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* ── Divider ──────────────────────────────────────── */}
      <div className="border-t border-slate-200" />

      {/* ── Price Breakdown ──────────────────────────────── */}
      <div className="flex flex-col gap-2 text-sm">

        {/* Items count */}
        <div className="flex justify-between text-slate-500">
          <span>Subtotal ({count} items)</span>
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
          <span className="text-blue-600">${finalTotal.toFixed(2)}</span>
        </div>

      </div>

      {/* ── Secure Checkout Note ─────────────────────────── */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 border-t border-slate-100 pt-3">
        <span>🔒</span>
        <span>Secure checkout — your data is safe</span>
      </div>

    </div>
  );
};

export default OrderSummary;