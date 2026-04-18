// src/pages/admin/AdminDashboard.jsx

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetDashboardStats } from "../features/admin/adminApi";
import {
  selectAdminStats,
  selectRecentOrders,
  selectTopProducts,
  selectOrdersByStatus,
  selectAdminLoading,
} from "../features/admin/adminSlice";

// ─── Status config ────────────────────────────────────────────
const statusConfig = {
  confirmed: { label: "Confirmed", bg: "bg-green-100", text: "text-green-600", icon: "✅" },
  processing: { label: "Processing", bg: "bg-yellow-100", text: "text-yellow-600", icon: "⏳" },
  shipped: { label: "Shipped", bg: "bg-blue-100", text: "text-blue-600", icon: "🚚" },
  delivered: { label: "Delivered", bg: "bg-slate-100", text: "text-slate-600", icon: "🎉" },
};

const AdminDashboard = () => {
  const { isLoading, isError } = useGetDashboardStats();

  const stats = useSelector(selectAdminStats);
  const recentOrders = useSelector(selectRecentOrders);
  const topProducts = useSelector(selectTopProducts);
  const ordersByStatus = useSelector(selectOrdersByStatus);
  const adminLoading = useSelector(selectAdminLoading);

  // ─── Stat cards config ────────────────────────────────
  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      text: "text-blue-600",
      link: "/admin/products",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: "📋",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      text: "text-green-600",
      link: "/admin/orders",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      text: "text-purple-600",
      link: "/admin/users",
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: "💰",
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      text: "text-yellow-600",
      link: "/admin/orders",
    },
  ];

  // ─── Format date ──────────────────────────────────────
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ─── Format Order ID ──────────────────────────────────
  const formatOrderId = (id) => {
    return `#ORD-${String(id).slice(0, 6).toUpperCase()}`;
  };

  // ─── Loading State ────────────────────────────────────
  if (isLoading && adminLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────
  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-2">
            Failed to load dashboard!
          </p>
          <p className="text-slate-400 text-sm">
            Make sure JSON Server is running
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      

      {/* ── Stat Cards ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className={`${card.bg} rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-slate-100 hover:shadow-md transition`}
          >
            {/* Icon */}
            <div className={`${card.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
              {card.icon}
            </div>

            {/* Value */}
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {card.label}
              </p>
              <p className={`text-2xl font-extrabold ${card.text}`}>
                {card.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Order Status Cards ────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(ordersByStatus).map(([status, count]) => {
          const config = statusConfig[status] || statusConfig.confirmed;
          return (
            <div
              key={status}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-center"
            >
              <p className="text-2xl mb-1">{config.icon}</p>
              <p className="text-xl font-bold text-slate-800">{count}</p>
              <p className={`text-xs font-medium ${config.text}`}>
                {config.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Recent Orders ───────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              View All →
            </Link>
          </div>

          {/* Orders list */}
          {recentOrders.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">
              No orders yet
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentOrders.map((order) => {
                const status = statusConfig[order.status] ||
                  statusConfig.confirmed;
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-2 py-2 border-b border-slate-100 last:border-0"
                  >
                    {/* Order ID + Date */}
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {formatOrderId(order.id)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {/* Items count */}
                    <p className="text-xs text-slate-500 hidden sm:block">
                      {order.items?.length} item{order.items?.length > 1 ? "s" : ""}
                    </p>

                    {/* Status */}
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.bg} ${status.text}`}>
                      {status.icon} {status.label}
                    </span>

                    {/* Total */}
                    <p className="text-sm font-bold text-blue-600">
                      ${order.total?.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* ── Top Products ────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">
              Top Products
            </h2>
            <Link
              to="/admin/products"
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              View All →
            </Link>
          </div>

          {/* Products list */}
          {topProducts.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">
              No products data
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0"
                >
                  {/* Rank */}
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                    ${index === 0 ? "bg-yellow-100 text-yellow-600" :
                      index === 1 ? "bg-slate-100 text-slate-600" :
                      index === 2 ? "bg-orange-100 text-orange-600" :
                      "bg-slate-50 text-slate-400"}`}
                  >
                    {index + 1}
                  </span>

                  {/* Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                  />

                  {/* Name + Category */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {product.category}
                    </p>
                  </div>

                  {/* Price + Sold */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-800">
                      ${product.price}
                    </p>
                    <p className="text-xs text-slate-400">
                      {product.totalSold} sold
                    </p>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;