// src/features/cart/cartSlice.js

import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    // ─── Loading ──────────────────────────────────────────
    cartLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // ─── Fetch Cart ───────────────────────────────────────
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // ─── Add Item ─────────────────────────────────────────
    addCartItem: (state, action) => {
    const existingItem = state.items.find(
        (item) => item.id === action.payload.id
    );

    if (existingItem) {
        existingItem.quantity += 1; // ✅ increase quantity
    } else {
        state.items.push({ ...action.payload, quantity: 1 }); // ✅ new item
    }
    },

    // ─── Update Quantity ──────────────────────────────────
    updateCartItem: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = quantity;
      }
      state.isLoading = false;
    },

    // ─── Remove Item ──────────────────────────────────────
    removeCartItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.isLoading = false;
    },

    // ─── Clear Cart (on logout) ───────────────────────────
    clearCart: (state) => {
      state.items = [];
      state.isLoading = false;
      state.error = null;
    },

    // ─── Error ────────────────────────────────────────────
    cartError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  cartLoading,
  setCartItems,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  cartError,
} = cartSlice.actions;

// ─── Base Selectors ───────────────────────────────────────────
export const selectCartItems = (state) => state.cart?.items ?? [];
export const selectCartLoading = (state) => state.cart?.isLoading ?? false;
export const selectCartError = (state) => state.cart?.error ?? null;


// ─── Memoized Selectors ───────────────────────────────────────

// Total items quantity (for cart page)
export const selectCartTotalQuantity = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

// ✅ Total products (for navbar badge)
export const selectCartCount = createSelector(
  [selectCartItems],
  (items) => items.length
);

// Total price
export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0)
);

// Total savings
export const selectCartSavings = createSelector(
  [selectCartItems],
  (items) =>
    items.reduce(
      (total, item) =>
        total + (item.originalPrice - item.price) * item.quantity,
      0
    )
);

export default cartSlice.reducer;