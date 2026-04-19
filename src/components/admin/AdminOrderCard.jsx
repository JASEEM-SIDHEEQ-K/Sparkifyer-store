// src/components/admin/AdminOrderCard.jsx

import { useState } from "react";
import { useUpdateOrderStatus, useCancelOrder } from "../../features/admin/adminApi";

const statusConfig = {
  confirmed: { label: "Confirmed", bg: "bg-green-100", text: "text-green-600", icon: "✅" },
  processing: { label: "Processing", bg: "bg-yellow-100", text: "text-yellow-600", icon: "⏳" },
  shipped: { label: "Shipped", bg: "bg-blue-100", text: "text-blue-600", icon: "🚚" },
  delivered: { label: "Delivered", bg: "bg-slate-100", text: "text-slate-600", icon: "🎉" },
  cancelled: { label: "Cancelled", bg: "bg-red-100", text: "text-red-600", icon: "❌" },
};

const statusFlow = ["confirmed", "processing", "shipped", "delivered"];

const AdminOrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const status = statusConfig[order.status] || statusConfig.confirmed;
  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "delivered";
  const currentIndex = statusFlow.indexOf(order.status);
  const nextStatus = statusFlow[currentIndex + 1] || null;
  const nextStatusConfig = nextStatus ? statusConfig[nextStatus] : null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatOrderId = (id) => {
    return `#ORD-${String(id).slice(0, 6).toUpperCase()}`;
  };

  const handleStatusUpdate = () => {
    if (!nextStatus) return;
    updateStatus({ orderId: order.id, status: nextStatus });
  };

  const handleCancel = () => {
    cancelOrder(order.id);
    setShowCancelConfirm(false);
  };

  return (
    <div className={`bg-white border rounded-2xl shadow-sm overflow-hidden
      ${isCancelled ? "border-red-200 opacity-75" : "border-slate-200"}`}
    >

      {/* ── Order Header ──────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 cursor-pointer hover:bg-slate-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-bold text-slate-800">
              {formatOrderId(order.id)}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {order.items?.length} item{order.items?.length > 1 ? "s" : ""}
          </span>
          <span className="text-xs text-slate-500">
            {order.paymentMethod === "card" ? "💳 Card" : "💵 COD"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.bg} ${status.text}`}>
            {status.icon} {status.label}
          </span>
          <span className="text-sm font-bold text-blue-600">
            ${order.total?.toFixed(2)}
          </span>
          <span className={`text-slate-400 text-sm transition-transform duration-200
            ${expanded ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </div>
      </div>

      {/* ── Expanded Content ──────────────────────────────── */}
      {expanded && (
        <div className="border-t border-slate-100 p-4 flex flex-col gap-4">

          {/* ── Cancelled Banner ──────────────────────────── */}
          {isCancelled && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
              ❌ This order has been cancelled
            </div>
          )}

          {/* ── Order Items ─────────────────────────────── */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Order Items
            </p>
            <div className="flex flex-col gap-2">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-slate-50 rounded-xl p-3"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      ${item.price} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-800 flex-shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Order Info Grid ──────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Shipping Address */}
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Shipping Address
              </p>
              <p className="text-sm font-medium text-slate-800">
                {order.shippingAddress?.name}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {order.shippingAddress?.address}
              </p>
              <p className="text-xs text-slate-500">
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.zip}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                📞 {order.shippingAddress?.phone}
              </p>
            </div>

            {/* Price Summary */}
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Price Summary
              </p>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span>${order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Delivery</span>
                  <span>
                    {order.deliveryCharge === 0
                      ? "FREE"
                      : `$${order.deliveryCharge?.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-800 border-t border-slate-200 pt-1 mt-1">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ${order.total?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* ── Status Timeline ──────────────────────────── */}
          {!isCancelled && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Order Timeline
              </p>
              <div className="flex items-start justify-between relative">
                {statusFlow.map((s, index) => {
                  const config = statusConfig[s];
                  const isDone = statusFlow.indexOf(order.status) >= index;
                  return (
                    <div
                      key={s}
                      className="flex flex-col items-center gap-1 flex-1 relative z-10"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                        ${isDone ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}
                      >
                        {config.icon}
                      </div>
                      <p className={`text-xs font-medium text-center
                        ${isDone ? "text-blue-600" : "text-slate-400"}`}
                      >
                        {config.label}
                      </p>
                    </div>
                  );
                })}
                {/* Timeline line */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 z-0" />
              </div>
            </div>
          )}

          {/* ── Action Buttons ────────────────────────────── */}
          {!isCancelled && !isDelivered && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-3">

              {/* Cancel Confirm */}
              {showCancelConfirm ? (
                <div className="flex items-center gap-2 flex-1">
                  <p className="text-xs text-red-600 font-medium">
                    Are you sure?
                  </p>
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition disabled:opacity-60"
                  >
                    {isCancelling ? "Cancelling..." : "Yes, Cancel"}
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="border border-slate-300 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-xl hover:bg-slate-50 transition"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-xl transition border border-red-200"
                >
                  ❌ Cancel Order
                </button>
              )}

              {/* Move to Next Status */}
              {nextStatus && !showCancelConfirm && (
                <button
                  onClick={handleStatusUpdate}
                  disabled={isPending}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition disabled:opacity-60"
                >
                  {isPending ? (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    nextStatusConfig?.icon
                  )}
                  Move to {nextStatusConfig?.label}
                </button>
              )}

            </div>
          )}

          {/* Delivered state */}
          {isDelivered && (
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <span className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1.5 rounded-xl">
                🎉 Order Delivered
              </span>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AdminOrderCard;