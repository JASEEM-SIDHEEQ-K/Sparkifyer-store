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
      const response = await api.get(`/orders`);
      dispatch(setOrders(response.data.orders));
      return response.data.orders;
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
    mutationFn: async ({ orderData, cartItems, isBuyNow }) => {
      const response = await api.post("/orders", {
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
        paymentMethod: orderData.paymentMethod,
        shippingAddress: orderData.shippingAddress,
        isBuyNow,
      });
      return response.data.order;
    },

    onSuccess: (order, variables) => {
      dispatch(setCurrentOrder(order));

      if (variables.isBuyNow) {
        dispatch(clearBuyNowItem());
      } else {
        dispatch(clearCart());
        queryClient.invalidateQueries({
          queryKey: ["cart", variables.userId],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({
        queryKey: ["orders", variables.userId],
      });

      navigate("/order-success");
    },

    onError: (error) => {
      dispatch(orderError(
        error.response?.data?.message || "Failed to place order!"
      ));
    },
  });
};