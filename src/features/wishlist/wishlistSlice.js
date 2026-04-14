import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {

    
    wishlistLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },

  
    setWishlistItems: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    
    addWishlistItem: (state, action) => {
      state.items.push(action.payload);
      state.isLoading = false;
    },

    
    removeWishlistItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
      state.isLoading = false;
    },

    
    clearWishlist: (state) => {
      state.items = [];
      state.isLoading = false;
      state.error = null;
    },

    
    wishlistError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  wishlistLoading,
  setWishlistItems,
  addWishlistItem,
  removeWishlistItem,
  clearWishlist,
  wishlistError,
} = wishlistSlice.actions;

// ─── Base Selectors ───────────────────────────────────────────
export const selectWishlistItems = (state) =>
  state.wishlist?.items ?? [];
export const selectWishlistLoading = (state) =>
  state.wishlist?.isLoading ?? false;
export const selectWishlistError = (state) =>
  state.wishlist?.error ?? null;

// ─── Memoized Selectors ───────────────────────────────────────

// Total wishlist count → navbar badge
export const selectWishlistCount = createSelector(
  [selectWishlistItems],
  (items) => items.length
);

// Check if specific product is in wishlist
export const selectIsInWishlist = (productId) =>
  createSelector(
    [selectWishlistItems],
    (items) =>
      items.some((item) => item.productId === productId ||
        item.productId === String(productId)
      )
  );

// Get wishlist item by productId
export const selectWishlistItemByProductId = (productId) =>
  createSelector(
    [selectWishlistItems],
    (items) =>
      items.find(
        (item) =>
          item.productId === productId ||
          item.productId === String(productId)
      ) ?? null
  );

export default wishlistSlice.reducer;