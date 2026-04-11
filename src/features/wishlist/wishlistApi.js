// src/features/wishlist/wishlistApi.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import {
  setWishlistItems,
  addWishlistItem,
  removeWishlistItem,
  wishlistError,
} from "./wishlistSlice";

// ─── Fetch Wishlist ───────────────────────────────────────────
export const useGetWishlist = (userId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["wishlist", userId],
    queryFn: async () => {
      const response = await api.get(`/wishlist?userId=${userId}`);
      dispatch(setWishlistItems(response.data));
      return response.data;
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
    mutationFn: async ({ product, userId, wishlistItems }) => {

      // ✅ check if already in wishlist
      const existingItem = wishlistItems.find(
        (item) =>
          item.productId === product.id ||
          item.productId === String(product.id)
      );

      if (existingItem) {
        // ── Already in wishlist → REMOVE ──────────────
        await api.delete(`/wishlist/${existingItem.id}`);
        return { type: "remove", id: existingItem.id };

      } else {
        // ── Not in wishlist → ADD ──────────────────────
        const newItem = {
          userId,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          stock: product.stock,
          category: product.category,
          brand: product.brand,
          rating: product.rating,
        };

        const response = await api.post("/wishlist", newItem);
        return { type: "add", item: response.data };
      }
    },

    onSuccess: (result, variables) => {
      if (result.type === "remove") {
        dispatch(removeWishlistItem(result.id));
      } else {
        dispatch(addWishlistItem(result.item));
      }
      queryClient.invalidateQueries({
        queryKey: ["wishlist", variables.userId],
      });
    },

    onError: (error) => {
      dispatch(wishlistError(error.message || "Wishlist action failed!"));
    },
  });
};

// ─── Remove from Wishlist ─────────────────────────────────────
export const useRemoveFromWishlist = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ wishlistItemId }) => {
      await api.delete(`/wishlist/${wishlistItemId}`);
      return { wishlistItemId };
    },

    onSuccess: (result, variables) => {
      dispatch(removeWishlistItem(result.wishlistItemId));
      queryClient.invalidateQueries({
        queryKey: ["wishlist", variables.userId],
      });
    },

    onError: (error) => {
      dispatch(wishlistError(error.message || "Failed to remove from wishlist!"));
    },
  });
};