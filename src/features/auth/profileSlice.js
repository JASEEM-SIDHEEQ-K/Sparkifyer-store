// src/features/auth/profileSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  updateSuccess: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {

    // ─── Fetch Profile ────────────────────────────────────
    profileLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    setProfile: (state, action) => {
      state.profile = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // ─── Update Profile ───────────────────────────────────
    updateLoading: (state) => {
      state.isUpdating = true;
      state.error = null;
      state.updateSuccess = false;
    },

    updateProfileSuccess: (state, action) => {
      state.profile = action.payload;
      state.isUpdating = false;
      state.updateSuccess = true;
      state.error = null;
    },

    // ─── Clear Success Message ────────────────────────────
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },

    // ─── Clear Profile (on logout) ────────────────────────
    clearProfile: (state) => {
      state.profile = null;
      state.isLoading = false;
      state.isUpdating = false;
      state.error = null;
      state.updateSuccess = false;
    },

    // ─── Error ────────────────────────────────────────────
    profileError: (state, action) => {
      state.isLoading = false;
      state.isUpdating = false;
      state.error = action.payload;
    },
  },
});

export const {
  profileLoading,
  setProfile,
  updateLoading,
  updateProfileSuccess,
  clearUpdateSuccess,
  clearProfile,
  profileError,
} = profileSlice.actions;

// ─── Selectors ────────────────────────────────────────────────
export const selectProfile = (state) => state.profile?.profile ?? null;
export const selectProfileLoading = (state) => state.profile?.isLoading ?? false;
export const selectProfileUpdating = (state) => state.profile?.isUpdating ?? false;
export const selectProfileError = (state) => state.profile?.error ?? null;
export const selectUpdateSuccess = (state) => state.profile?.updateSuccess ?? false;

export default profileSlice.reducer;