// src/components/profile/OrderHistory.jsx

import { useSelector } from "react-redux";
import { selectOrders } from "../../features/checkout/orderSlice";
import { useGetOrders } from "../../features/checkout/orderApi";

const statusConfig = {
  confirmed: {
    label: "Confirmed",
    bg: "bg-green-100",
    text: "text-green-600",
    icon: "✅",
  },
  processing: {
    label: "Processing",
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    icon: "⏳",
  },
  shipped: {
    label: "Shipped",
    bg: "bg-blue-100",
    text: "text-blue-600",
    icon: "🚚",
  },
  delivered: {
    label: "Delivered",
    bg: "bg-slate-100",
    text: "text-slate-600",
    icon: "🎉",
  },
};

const OrderHistory = ({ userId }) => {
  const orders = useSelector(selectOrders);

  // ─── Fetch orders ──────────────────────────────────────
  const { isLoading } = useGetOrders(userId);

  // ─── Format date ───────────────────────────────────────
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ─── Format Order ID ───────────────────────────────────
  const formatOrderId = (id) => {
    return `#ORD-${String(id).slice(0, 6).toUpperCase()}`;
  };

  // ─── Loading ───────────────────────────────────────────
  if (isLoading && orders.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-slate-100 rounded-2xl h-24 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // ─── Empty State ───────────────────────────────────────
  if (orders.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm text-center">
        <p className="text-4xl mb-3">📦</p>
        <h3 className="text-base font-bold text-slate-700 mb-1">
          No orders yet
        </h3>
        <p className="text-slate-400 text-sm">
          Your order history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Orders Header ─────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">
          Order History
        </h2>
        <span className="text-xs text-slate-400 font-medium">
          {orders.length} order{orders.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Orders List ───────────────────────────────────── */}
      {[...orders].reverse().map((order) => {

        const status = statusConfig[order.status] || statusConfig.confirmed;

        return (
          <div
            key={order.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4"
          >

            {/* ── Order Header ────────────────────────────── */}
            <div className="flex items-start justify-between gap-2">

              {/* Order ID + Date */}
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {formatOrderId(order.id)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatDate(order.createdAt)}
                </p>
              </div>

              {/* Status Badge */}
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.bg} ${status.text}`}>
                {status.icon} {status.label}
              </span>

            </div>

            {/* ── Order Items ─────────────────────────────── */}
            <div className="flex flex-col gap-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  {/* Image */}
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

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      ${item.price} × {item.quantity}
                    </p>
                  </div>

                  {/* Subtotal */}
                  <span className="text-xs font-semibold text-slate-800 flex-shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                </div>
              ))}
            </div>

            {/* ── Order Footer ─────────────────────────────── */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">

              {/* Payment method */}
              <div className="flex items-center gap-1.5">
                <span className="text-sm">
                  {order.paymentMethod === "card" ? "💳" : "💵"}
                </span>
                <span className="text-xs text-slate-500">
                  {order.paymentMethod === "card"
                    ? "Card Payment"
                    : "Cash on Delivery"}
                </span>
              </div>

              {/* Total */}
              <div className="text-right">
                <p className="text-xs text-slate-400">Total</p>
                <p className="text-sm font-bold text-blue-600">
                  ${order.total?.toFixed(2)}
                </p>
              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
};

export default OrderHistory;