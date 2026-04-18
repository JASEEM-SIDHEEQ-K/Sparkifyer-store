// src/features/admin/adminSlice.js

import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  stats: {
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  },
  recentOrders: [],
  topProducts: [],
  allOrders: [],
  allUsers: [],
  allProducts: [],
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {

    // ─── Loading ──────────────────────────────────────────
    adminLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // ─── Set Stats ────────────────────────────────────────
    setStats: (state, action) => {
      state.stats = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // ─── Set Recent Orders ────────────────────────────────
    setRecentOrders: (state, action) => {
      state.recentOrders = action.payload;
      state.isLoading = false;
    },

    // ─── Set Top Products ─────────────────────────────────
    setTopProducts: (state, action) => {
      state.topProducts = action.payload;
      state.isLoading = false;
    },

    // ─── Set All Orders ───────────────────────────────────
    setAllOrders: (state, action) => {
      state.allOrders = action.payload;
      state.isLoading = false;
    },

    // ─── Set All Users ────────────────────────────────────
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
      state.isLoading = false;
    },

    // ─── Set All Products ─────────────────────────────────
    setAllProducts: (state, action) => {
      state.allProducts = action.payload;
      state.isLoading = false;
    },

    // ─── Update Order Status ──────────────────────────────
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.allOrders.find((o) => o.id === orderId);
      if (order) {
        order.status = status;
      }
      const recentOrder = state.recentOrders.find((o) => o.id === orderId);
      if (recentOrder) {
        recentOrder.status = status;
      }
    },

    // ─── Delete Product ───────────────────────────────────
    deleteProduct: (state, action) => {
      state.allProducts = state.allProducts.filter(
        (p) => p.id !== action.payload
      );
      state.stats.totalProducts -= 1;
    },

    // ─── Clear Admin (on logout) ──────────────────────────
    clearAdmin: (state) => {
      state.stats = initialState.stats;
      state.recentOrders = [];
      state.topProducts = [];
      state.allOrders = [];
      state.allUsers = [];
      state.allProducts = [];
      state.isLoading = false;
      state.error = null;
    },

    // ─── Error ────────────────────────────────────────────
    adminError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  adminLoading,
  setStats,
  setRecentOrders,
  setTopProducts,
  setAllOrders,
  setAllUsers,
  setAllProducts,
  updateOrderStatus,
  deleteProduct,
  clearAdmin,
  adminError,
} = adminSlice.actions;

// ─── Selectors ────────────────────────────────────────────────
export const selectAdminStats = (state) =>
  state.admin?.stats ?? initialState.stats;
export const selectRecentOrders = (state) =>
  state.admin?.recentOrders ?? [];
export const selectTopProducts = (state) =>
  state.admin?.topProducts ?? [];
export const selectAllOrders = (state) =>
  state.admin?.allOrders ?? [];
export const selectAllUsers = (state) =>
  state.admin?.allUsers ?? [];
export const selectAllProducts = (state) =>
  state.admin?.allProducts ?? [];
export const selectAdminLoading = (state) =>
  state.admin?.isLoading ?? false;
export const selectAdminError = (state) =>
  state.admin?.error ?? null;

// ─── Memoized Selectors ───────────────────────────────────────

// confirmed orders only
export const selectConfirmedOrders = createSelector(
  [selectAllOrders],
  (orders) => orders.filter((o) => o.status === "confirmed")
);

// total revenue from all orders
export const selectTotalRevenue = createSelector(
  [selectAllOrders],
  (orders) =>
    orders.reduce((total, order) => total + (order.total || 0), 0)
);

// orders by status count
export const selectOrdersByStatus = createSelector(
  [selectAllOrders],
  (orders) => ({
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  })
);

export default adminSlice.reducer;