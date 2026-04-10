// src/features/auth/profileApi.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import {
  setProfile,
  updateProfileSuccess,
  profileError,
} from "./profileSlice";
import { loginSuccess } from "./authSlice";
import { getSession, saveSession } from "../../utils/localStorage";

// ─── Fetch Profile ────────────────────────────────────────────
export const useGetProfile = (userId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`);
      dispatch(setProfile(response.data));
      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

// ─── Update Profile ───────────────────────────────────────────
export const useUpdateProfile = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updatedData }) => {
      const response = await api.patch(`/users/${userId}`, updatedData);
      return response.data;
    },

    onSuccess: (updatedUser, variables) => {
      // ✅ update profile in Redux
      dispatch(updateProfileSuccess(updatedUser));

      // ✅ update auth session in Redux + localStorage
      const session = getSession();
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
        },
      };
      saveSession(updatedSession);
      dispatch(loginSuccess(updatedSession));

      // ✅ invalidate profile query
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.userId],
      });
    },

    onError: (error) => {
      dispatch(profileError(error.message || "Failed to update profile!"));
    },
  });
};

// ─── Change Password ──────────────────────────────────────────
export const useChangePassword = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ userId, currentPassword, newPassword }) => {
      // ✅ verify current password first
      const response = await api.get(`/users/${userId}`);
      const user = response.data;

      if (user.password !== currentPassword) {
        throw new Error("Current password is incorrect!");
      }

      // ✅ update password
      const updated = await api.patch(`/users/${userId}`, {
        password: newPassword,
      });

      return updated.data;
    },

    onSuccess: () => {
      // password changed successfully
    },

    onError: (error) => {
      dispatch(profileError(error.message || "Failed to change password!"));
    },
  });
};