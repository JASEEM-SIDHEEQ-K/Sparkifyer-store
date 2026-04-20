// src/components/admin/AdminUserCard.jsx

import { useState } from "react";
import api from "../../services/api";

const AdminUserCard = ({ user, orderCount, onStatusToggle }) => {
  const [isToggling, setIsToggling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isActive = user.isActive !== false;

  // ─── Format date ───────────────────────────────────────
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ─── Handle Toggle ─────────────────────────────────────
  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await api.patch(`/users/${user.id}`, {
        isActive: !isActive,
      });
      onStatusToggle(user.id, !isActive);
      setShowConfirm(false);
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    } finally {
      setIsToggling(false);
    }
  };

  // ─── Avatar initials ───────────────────────────────────
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`bg-white border rounded-2xl p-4 shadow-sm transition
      ${!isActive ? "opacity-60 border-slate-200" : "border-slate-200 hover:shadow-md"}`}
    >

      <div className="flex items-center gap-4">

        {/* ── Avatar ──────────────────────────────────── */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0
          ${user.role === "admin" ? "bg-purple-600" : "bg-blue-600"}`}
        >
          {getInitials(user.name)}
        </div>

        {/* ── User Info ────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Name + Role */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-slate-800 truncate">
              {user.name}
            </h3>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
              ${user.role === "admin"
                ? "bg-purple-100 text-purple-600"
                : "bg-blue-100 text-blue-600"
              }`}
            >
              {user.role === "admin" ? "👑 Admin" : "👤 User"}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
              ${isActive
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-500"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Email */}
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {user.email}
          </p>

          {/* Phone + Joined */}
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {user.phone && (
              <span className="text-xs text-slate-400">
                📞 {user.phone}
              </span>
            )}
            <span className="text-xs text-slate-400">
              🗓 Joined {formatDate(user.createdAt)}
            </span>
            {user.role !== "admin" && (
              <span className="text-xs text-slate-400">
                📦 {orderCount} order{orderCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>

        </div>

        {/* ── Actions ──────────────────────────────────── */}
        <div className="flex-shrink-0">
          {user.role !== "admin" && (
            <>
              {showConfirm ? (
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-500">Sure?</p>
                  <button
                    onClick={handleToggle}
                    disabled={isToggling}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition disabled:opacity-60
                      ${isActive
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                  >
                    {isToggling ? "..." : "Yes"}
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 transition"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition border
                    ${isActive
                      ? "bg-red-50 hover:bg-red-100 text-red-500 border-red-200"
                      : "bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                    }`}
                >
                  {isActive ? "🚫 Deactivate" : "✅ Activate"}
                </button>
              )}
            </>
          )}
        </div>

      </div>

    </div>
  );
};

export default AdminUserCard;