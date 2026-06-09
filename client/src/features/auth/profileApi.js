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
      const response = await api.get("/auth/profile");
      dispatch(setProfile(response.data.user));
      return response.data.user;
    },
    enabled: !!userId,
    staleTime: 0,
    retry: 1,
  });
};

// ─── Update Profile ───────────────────────────────────────────
export const useUpdateProfile = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ updatedData }) => {
      const response = await api.put("/auth/profile", updatedData);
      return response.data;
    },

    onSuccess: (data) => {
      dispatch(updateProfileSuccess(data.user));

      const session = getSession();
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          name: data.user.name,
          phone: data.user.phone,
        },
      };
      saveSession(updatedSession);
      dispatch(loginSuccess(updatedSession));

      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },

    onError: (error) => {
      dispatch(profileError(
        error.response?.data?.message || "Failed to update profile!"
      ));
    },
  });
};

// ─── Change Password ──────────────────────────────────────────
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }) => {
      const response = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    },

    onError: (error) => {
      throw new Error(
        error.response?.data?.message || "Failed to change password!"
      );
    },
  });
};