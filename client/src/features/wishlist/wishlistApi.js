import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import {
  setWishlistItems,
  // addWishlistItem,
  // removeWishlistItem,
  wishlistError,
} from "./wishlistSlice";

// ─── Fetch Wishlist ───────────────────────────────────────────
export const useGetWishlist = (userId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["wishlist", userId],
    queryFn: async () => {
      const response = await api.get(`/wishlist`);
      dispatch(setWishlistItems(response.data.wishlist.items));
      return response.data.wishlist.items;
    },
    enabled: !!userId,
    staleTime: 0,
    retry: 1,
  });
};

// ─── Toggle Wishlist (Add or Remove) ─────────────────────────
export const useToggleWishlist = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ product }) => {
      const response = await api.post("/wishlist/toggle", {
        productId: product.id,
      });
      return response.data;
    },

    onSuccess: (data, variables) => {
      // ✅ update Redux with latest wishlist
      dispatch(setWishlistItems(data.wishlist.items));
      queryClient.invalidateQueries({
        queryKey: ["wishlist", variables.userId],
      });
    },

    onError: (error) => {
      dispatch(wishlistError(
        error.response?.data?.message || "Wishlist action failed!"
      ));
    },
  });
};

// ─── Remove from Wishlist ─────────────────────────────────────
export const useRemoveFromWishlist = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ wishlistItemId }) => {
      const response = await api.delete(`/wishlist/${wishlistItemId}`);
      return response.data;
    },

    onSuccess: (data, variables) => {
      dispatch(setWishlistItems(data.wishlist.items));
      queryClient.invalidateQueries({
        queryKey: ["wishlist", variables.userId],
      });
    },

    onError: (error) => {
      dispatch(wishlistError(error.response?.data?.message || "Failed to remove from wishlist!"));
    },
  });
};