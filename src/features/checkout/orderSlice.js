// src/features/checkout/orderSlice.js

import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  currentOrder: null,      // last placed order → for success page
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {

    // ─── Loading ──────────────────────────────────────────
    orderLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // ─── Fetch Orders ─────────────────────────────────────
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // ─── Place Order → save current order ─────────────────
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
      state.orders.push(action.payload);
      state.isLoading = false;
      state.error = null;
    },

    // ─── Clear Current Order ──────────────────────────────
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },

    // ─── Clear Orders (on logout) ─────────────────────────
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.isLoading = false;
      state.error = null;
    },

    // ─── Error ────────────────────────────────────────────
    orderError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  orderLoading,
  setOrders,
  setCurrentOrder,
  clearCurrentOrder,
  clearOrders,
  orderError,
} = orderSlice.actions;

// ─── Selectors ────────────────────────────────────────────────
export const selectOrders = (state) => state.orders?.orders ?? [];
export const selectCurrentOrder = (state) => state.orders?.currentOrder ?? null;
export const selectOrderLoading = (state) => state.orders?.isLoading ?? false;
export const selectOrderError = (state) => state.orders?.error ?? null;

// ─── Memoized Selectors ───────────────────────────────────────

// Total orders count
export const selectOrdersCount = createSelector(
  [selectOrders],
  (orders) => orders.length
);

// Latest order
export const selectLatestOrder = createSelector(
  [selectOrders],
  (orders) => orders[orders.length - 1] ?? null
);

export default orderSlice.reducer;