// src/pages/OrderSuccess.jsx

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentOrder,
  clearCurrentOrder,
} from "../features/checkout/orderSlice";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const order = useSelector(selectCurrentOrder);

  // ─── Redirect if no order ─────────────────────────────
  useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  // ─── Clear current order on leave ─────────────────────
  useEffect(() => {
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* ── Success Banner ────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">

          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-slate-500 text-sm mb-4">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          {/* Order ID */}
          <div className="bg-slate-50 rounded-xl px-4 py-2 inline-block">
            <p className="text-xs text-slate-500">
              Order ID:{" "}
              <span className="font-bold text-slate-800">
                #ORD-{String(order.id).padStart(4, "0")}
              </span>
            </p>
          </div>

        </div>

        {/* ── Order Details ─────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4">
            📦 Order Details
          </h2>

          {/* Items */}
          <div className="flex flex-col gap-3 mb-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">

                {/* Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
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
                <span className="text-sm font-semibold text-slate-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>

              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 my-3" />

          {/* Price Summary */}
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>${order.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Delivery</span>
              <span>
                {order.deliveryCharge === 0 ? (
                  <span className="text-green-500 font-medium">FREE</span>
                ) : (
                  `$${order.deliveryCharge?.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="border-t border-slate-200 my-1" />
            <div className="flex justify-between font-bold text-slate-800">
              <span>Total Paid</span>
              <span className="text-blue-600">
                ${order.total?.toFixed(2)}
              </span>
            </div>
          </div>

        </div>

        {/* ── Shipping Address ──────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-3">
            🚚 Shipping Address
          </h2>
          <div className="text-sm text-slate-600 flex flex-col gap-1">
            <p className="font-medium text-slate-800">
              {order.shippingAddress?.name}
            </p>
            <p>{order.shippingAddress?.address}</p>
            <p>
              {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.zip}
            </p>
            <p>📞 {order.shippingAddress?.phone}</p>
          </div>
        </div>

        {/* ── Payment Method ────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-3">
            💳 Payment
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {order.paymentMethod === "card" ? "💳" : "💵"}
            </span>
            <span className="text-sm text-slate-600 font-medium">
              {order.paymentMethod === "card"
                ? "Paid by Credit / Debit Card"
                : "Cash on Delivery"}
            </span>
            {order.paymentMethod === "card" && (
              <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                ✓ Paid
              </span>
            )}
            {order.paymentMethod === "cod" && (
              <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
                Pending
              </span>
            )}
          </div>
        </div>

        {/* ── Order Status ──────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4">
            📋 Order Status
          </h2>
          <div className="flex items-center justify-between">

            {/* Confirmed */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-sm">✓</span>
              </div>
              <p className="text-xs text-green-600 font-medium">Confirmed</p>
            </div>

            {/* Line */}
            <div className="flex-1 h-0.5 bg-slate-200 mx-2" />

            {/* Processing */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="text-sm text-slate-400">📦</span>
              </div>
              <p className="text-xs text-slate-400">Processing</p>
            </div>

            {/* Line */}
            <div className="flex-1 h-0.5 bg-slate-200 mx-2" />

            {/* Shipped */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="text-sm text-slate-400">🚚</span>
              </div>
              <p className="text-xs text-slate-400">Shipped</p>
            </div>

            {/* Line */}
            <div className="flex-1 h-0.5 bg-slate-200 mx-2" />

            {/* Delivered */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="text-sm text-slate-400">🎉</span>
              </div>
              <p className="text-xs text-slate-400">Delivered</p>
            </div>

          </div>
        </div>

        {/* ── Action Buttons ────────────────────────────── */}
        <div className="flex gap-3">
          <Link
            to="/products"
            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="flex-1 text-center border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium py-3 rounded-xl transition"
          >
            Go to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;