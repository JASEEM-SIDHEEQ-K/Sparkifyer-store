import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllUsers,
  selectAllOrders,
  setAllUsers,
} from "../features/admin/adminSlice";
import AdminUserCard from "../components/admin/AdminUserCard";

const ITEMS_PER_PAGE = 8;

const AdminUsers = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector(selectAllUsers);
  const allOrders = useSelector(selectAllOrders);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Get order count per user ─────────────────────────
  const orderCountMap = useMemo(() => {
    const map = {};
    allOrders.forEach((order) => {
      const uid = order.userId;
      map[uid] = (map[uid] || 0) + 1;
    });
    return map;
  }, [allOrders]);

  // ─── Filter + Sort ────────────────────────────────────
  const filteredUsers = useMemo(() => {
    let result = [...allUsers];

    // role filter
    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    // status filter
    if (statusFilter === "active") {
      result = result.filter((u) => u.isActive !== false);
    } else if (statusFilter === "inactive") {
      result = result.filter((u) => u.isActive === false);
    }

    // search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.includes(q)
      );
    }

    // sort
    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name?.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name?.localeCompare(a.name));
        break;
      case "orders-desc":
        result.sort(
          (a, b) =>
            (orderCountMap[b.id] || 0) - (orderCountMap[a.id] || 0)
        );
        break;
      case "orders-asc":
        result.sort(
          (a, b) =>
            (orderCountMap[a.id] || 0) - (orderCountMap[b.id] || 0)
        );
        break;
      default:
        break;
    }

    return result;
  }, [allUsers, roleFilter, statusFilter, searchQuery, sortBy, orderCountMap]);

  // ─── Pagination ───────────────────────────────────────
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ─── Reset page on filter change ──────────────────────
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  // ─── Handle status toggle ─────────────────────────────
  const handleStatusToggle = (userId, newStatus) => {
    const updatedUsers = allUsers.map((u) =>
      u.id === userId ? { ...u, isActive: newStatus } : u
    );
    dispatch(setAllUsers(updatedUsers));
  };

  // ─── Stats ────────────────────────────────────────────
  const totalUsers = allUsers.filter((u) => u.role === "user").length;
  const activeUsers = allUsers.filter(
    (u) => u.role === "user" && u.isActive !== false
  ).length;
  const inactiveUsers = allUsers.filter(
    (u) => u.role === "user" && u.isActive === false
  ).length;
  const adminCount = allUsers.filter((u) => u.role === "admin").length;

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page Header ───────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Users</h1>
        <p className="text-slate-500 text-sm mt-1">
          {totalUsers} users · {adminCount} admin
          {inactiveUsers > 0 && (
            <span className="text-red-400 ml-1">
              · {inactiveUsers} inactive
            </span>
          )}
        </p>
      </div>

      {/* ── Stats Cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl mb-1">👥</p>
          <p className="text-xl font-bold text-blue-600">{totalUsers}</p>
          <p className="text-xs text-slate-500 font-medium">Total Users</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl mb-1">✅</p>
          <p className="text-xl font-bold text-green-600">{activeUsers}</p>
          <p className="text-xs text-slate-500 font-medium">Active</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl mb-1">🚫</p>
          <p className="text-xl font-bold text-red-500">{inactiveUsers}</p>
          <p className="text-xs text-slate-500 font-medium">Inactive</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl mb-1">👑</p>
          <p className="text-xl font-bold text-purple-600">{adminCount}</p>
          <p className="text-xs text-slate-500 font-medium">Admins</p>
        </div>
      </div>

      {/* ── Search + Filters ──────────────────────────── */}
      <div className="flex flex-col gap-3">

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email or phone..."
            className="w-full border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3">

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => handleFilterChange(setRoleFilter)(e.target.value)}
            className="border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="all">👥 All Roles</option>
            <option value="user">👤 Users Only</option>
            <option value="admin">👑 Admins Only</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) =>
              handleFilterChange(setStatusFilter)(e.target.value)
            }
            className="border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="all">🔘 All Status</option>
            <option value="active">✅ Active</option>
            <option value="inactive">🚫 Inactive</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => handleFilterChange(setSortBy)(e.target.value)}
            className="border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="name-asc">🔤 Name A-Z</option>
            <option value="name-desc">🔤 Name Z-A</option>
            <option value="orders-desc">📦 Most Orders</option>
            <option value="orders-asc">📦 Least Orders</option>
          </select>

          {/* Reset */}
          {(roleFilter !== "all" ||
            statusFilter !== "all" ||
            sortBy !== "name-asc") && (
            <button
              onClick={() => {
                setRoleFilter("all");
                setStatusFilter("all");
                setSortBy("name-asc");
                setCurrentPage(1);
              }}
              className="text-xs text-blue-600 font-medium hover:underline px-2"
            >
              Reset Filters
            </button>
          )}

        </div>

      </div>

      {/* ── Results count ─────────────────────────────── */}
      {filteredUsers.length > 0 && (
        <p className="text-xs text-slate-400">
          Showing{" "}
          {Math.min(
            (currentPage - 1) * ITEMS_PER_PAGE + 1,
            filteredUsers.length
          )}{" "}
          to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}{" "}
          of {filteredUsers.length} users
        </p>
      )}

      {/* ── Users List ────────────────────────────────── */}
      {paginatedUsers.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">👥</p>
          <h3 className="text-base font-semibold text-slate-700 mb-1">
            No users found
          </h3>
          <p className="text-slate-400 text-sm">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {paginatedUsers.map((user) => (
            <AdminUserCard
              key={user.id}
              user={user}
              orderCount={orderCountMap[user.id] || 0}
              onStatusToggle={handleStatusToggle}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 mt-2">
          <p className="text-xs text-slate-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1">

            {/* Previous */}
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 text-slate-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ‹
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition
                    ${currentPage === page
                      ? "bg-blue-600 text-white border border-blue-600"
                      : "border border-slate-300 text-slate-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600"
                    }`}
                >
                  {page}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 text-slate-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ›
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;