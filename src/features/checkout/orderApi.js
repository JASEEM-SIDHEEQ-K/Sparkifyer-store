// src/features/checkout/orderApi.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  setOrders,
  setCurrentOrder,
  orderError,
  clearBuyNowItem,
} from "./orderSlice";
import { clearCart } from "../cart/cartSlice";

// ─── Fetch Orders ─────────────────────────────────────────────
export const useGetOrders = (userId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      const response = await api.get(`/orders?userId=${userId}`);
      dispatch(setOrders(response.data));
      return response.data;
    },
    enabled: !!userId,
    staleTime: 0,
    retry: 1,
  });
};

// ─── Place Order ──────────────────────────────────────────────
export const usePlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderData, cartItems, userId, isBuyNow }) => {

      // ── Step 1 → POST order ──────────────────────────
      const orderResponse = await api.post("/orders", {
        userId,
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: orderData.subtotal,
        deliveryCharge: orderData.deliveryCharge,
        total: orderData.total,
        status: "confirmed",
        paymentMethod: orderData.paymentMethod,
        shippingAddress: orderData.shippingAddress,
        createdAt: new Date().toISOString(),
      });

      // ── Step 2 → only clear cart for normal checkout ──
      if (!isBuyNow && cartItems.length > 0) {
        const deletePromises = cartItems.map((item) =>
          api.delete(`/cart/${item.id}`)
        );
        await Promise.all(deletePromises);
      }

      return orderResponse.data;
    },

    onSuccess: (placedOrder, variables) => {
      // ✅ save placed order
      dispatch(setCurrentOrder(placedOrder));

      if (variables.isBuyNow) {
        // ✅ Buy Now → clear buyNow item only
        dispatch(clearBuyNowItem());
      } else {
        // ✅ Normal checkout → clear cart
        dispatch(clearCart());
        queryClient.invalidateQueries({
          queryKey: ["cart", variables.userId],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["orders", variables.userId],
      });

      // ✅ navigate AFTER everything is done
      navigate("/order-success");
    },

    onError: (error) => {
      dispatch(orderError(error.message || "Failed to place order!"));
    },
  });
};