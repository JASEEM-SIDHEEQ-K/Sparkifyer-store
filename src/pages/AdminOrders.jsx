import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAllOrders } from "../features/admin/adminSlice";
import AdminOrderCard from "../components/admin/AdminOrderCard";

const statusTabs = [
  { value: "all", label: "All", icon: "📋" },
  { value: "confirmed", label: "Confirmed", icon: "✅" },
  { value: "processing", label: "Processing", icon: "⏳" },
  { value: "shipped", label: "Shipped", icon: "🚚" },
  { value: "delivered", label: "Delivered", icon: "🎉" },
  { value: "cancelled", label: "Cancelled", icon: "❌" },
];

const ITEMS_PER_PAGE = 8;

const AdminOrders = () => {
  const allOrders = useSelector(selectAllOrders);

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);



  // ─── Filter + Sort ────────────────────────────────────
  const filteredOrders = useMemo(() => {
    let result = [...allOrders];

    // status filter
    if (activeTab !== "all") {
      result = result.filter((o) => o.status === activeTab);
    }

    // payment filter
    if (paymentFilter !== "all") {
      result = result.filter((o) => o.paymentMethod === paymentFilter);
    }

    // date filter
    if (dateFilter !== "all") {
      const now = new Date();
      result = result.filter((o) => {
        const orderDate = new Date(o.createdAt);
        switch (dateFilter) {
          case "today":
            return orderDate.toDateString() === now.toDateString();
          case "week":
            {const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;}
          case "month":
            {const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;}
          default:
            return true;
        }
      });
    }

    // search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          String(o.id).toLowerCase().includes(q) ||
          o.shippingAddress?.name?.toLowerCase().includes(q) ||
          o.shippingAddress?.phone?.includes(q)
      );
    }

    // sort
    switch (sortBy) {
      case "date-desc":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "date-asc":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "amount-desc":
        result.sort((a, b) => b.total - a.total);
        break;
      case "amount-asc":
        result.sort((a, b) => a.total - b.total);
        break;
      default:
        break;
    }

    return result;
  }, [allOrders, activeTab, paymentFilter, dateFilter, searchQuery, sortBy]);

  // ─── Pagination for prevent next button ──────────────────────────
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // reset page on filter change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePaymentChange = (e) => {
    setPaymentFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  // ─── Stats ────────────────────────────────────────────
  const getCount = (status) => {
    if (status === "all") return allOrders.length;
    return allOrders.filter((o) => o.status === status).length;
  };

  const totalRevenue = allOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.total || 0), 0);




  return (
    <div className="flex flex-col gap-6">

      {/* ── Page Header ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Orders</h1>
          <p className="text-slate-500 text-sm mt-1">
            {allOrders.length} total orders · Revenue:
            <span className="text-blue-600 font-semibold ml-1">
              ${totalRevenue.toFixed(2)}
            </span>
          </p>
        </div>
      </div>

      

      {/* ── Search + Filters Row ──────────────────────── */}
      <div className="flex flex-col gap-3">

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by order ID, name or phone..."
            className="w-full border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3">

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={handlePaymentChange}
            className="border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="all">💳 All Payments</option>
            <option value="card">💳 Card (Paid)</option>
            <option value="cod">💵 Cash on Delivery</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={handleDateChange}
            className="border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="all">📅 All Dates</option>
            <option value="today">📅 Today</option>
            <option value="week">📅 Last 7 Days</option>
            <option value="month">📅 Last 30 Days</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="date-desc">🕒 Newest First</option>
            <option value="date-asc">🕒 Oldest First</option>
            <option value="amount-desc">💰 Highest Amount</option>
            <option value="amount-asc">💰 Lowest Amount</option>
          </select>

          {/* Reset Filters */}
          {(paymentFilter !== "all" ||
            dateFilter !== "all" ||
            sortBy !== "date-desc") && (
            <button
              onClick={() => {
                setPaymentFilter("all");
                setDateFilter("all");
                setSortBy("date-desc");
                setCurrentPage(1);
              }}
              className="text-xs text-blue-600 font-medium hover:underline px-2"
            >
              Reset Filters
            </button>
          )}

        </div>

      </div>

      {/* ── Status Tabs ───────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition
              ${activeTab === tab.value
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 border border-slate-300 hover:border-blue-400 hover:text-blue-600"
              }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ml-0.5
              ${activeTab === tab.value
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-500"
              }`}
            >
              {getCount(tab.value)}
            </span>
          </button>
        ))}
      </div>

      {/* ── Results count ─────────────────────────────── */}
      {filteredOrders.length > 0 && (
        <p className="text-xs text-slate-400">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of{" "}
          {filteredOrders.length} orders
        </p>
      )}





      {/* ── Orders List ───────────────────────────────── */}
      {paginatedOrders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📋</p>
          <h3 className="text-base font-semibold text-slate-700 mb-1">
            No orders found
          </h3>
          <p className="text-slate-400 text-sm">
            {searchQuery
              ? "Try a different search query"
              : "Try adjusting your filters"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {paginatedOrders.map((order) => (
            <AdminOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* ── Pagination ────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 mt-2">

          {/* Items info */}
          <p className="text-xs text-slate-400">
            Page {currentPage} of {totalPages}
          </p>

          {/* Buttons */}
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

export default AdminOrders;