// src/features/checkout/orderApi.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { setOrders, setCurrentOrder, orderError } from "./orderSlice";
import { clearCart } from "../cart/cartSlice";

// ─── Fetch Orders by UserId ───────────────────────────────────
export const useGetOrders = (userId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      const response = await api.get(`/orders?userId=${Number(userId)}`);
      dispatch(setOrders(response.data));
      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

// ─── Place Order ──────────────────────────────────────────────
export const usePlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderData, cartItems, userId }) => {

  // ── Step 1 → POST order ──────────────────────────────
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

  // ── Step 2 → DELETE cart items ───────────────────────
  // ✅ use item.id directly — no Number() conversion
  if (cartItems.length > 0) {
    const deletePromises = cartItems.map((item) =>
      api.delete(`/cart/${item.id}`)   // ✅ use as-is
    );
    await Promise.all(deletePromises);
  }

  return orderResponse.data;
},


    onSuccess: (placedOrder, variables) => {
      // ✅ save order to Redux
      dispatch(setCurrentOrder(placedOrder));

      // ✅ clear cart in Redux immediately
      dispatch(clearCart());

      // ✅ invalidate queries
      queryClient.invalidateQueries({ queryKey: ["orders", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });

      // ✅ redirect to success page
      navigate("/order-success");
    },

    onError: (error) => {
      dispatch(orderError(error.message || "Failed to place order!"));
    },
  });
};