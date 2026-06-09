// src/features/admin/adminApi.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useStore } from "react-redux";
import api from "../../services/api";
import {
  setStats,
  setRecentOrders,
  setTopProducts,
  setAllOrders,
  setAllUsers,
  setAllProducts,
  updateOrderStatus,
  cancelOrder,
  adminError,
} from "./adminSlice";
import { setOrders } from "../checkout/orderSlice";

// ─── Dashboard Stats ──────────────────────────────────────────
export const useGetDashboardStats = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const [statsRes, ordersRes, usersRes, productsRes] =
        await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/orders"),
          api.get("/admin/users"),
          api.get("/products/admin/all"),
        ]);

      const { stats, recentOrders, topProducts } =
        statsRes.data;

      dispatch(setStats(stats));
      dispatch(setRecentOrders(recentOrders));
      dispatch(setTopProducts(topProducts));
      dispatch(setAllOrders(ordersRes.data.orders));
      dispatch(setAllUsers(usersRes.data.users));
      dispatch(setAllProducts(productsRes.data.products));

      return statsRes.data;
    },
    staleTime: 0,
    retry: 1,
    refetchOnMount: true,
  });
};

// ─── Update Order Status ──────────────────────────────────────
export const useUpdateOrderStatus = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const store = useStore();

  return useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await api.patch(`/admin/orders/${orderId}`, {
        status,
      });
      return response.data;
    },

    onSuccess: (_, variables) => {
      dispatch(updateOrderStatus({
        orderId: variables.orderId,
        status: variables.status,
      }));

      const currentOrders = store.getState().orders?.orders ?? [];
      const updatedOrders = currentOrders.map((o) =>
        o.id === variables.orderId || o._id === variables.orderId
          ? { ...o, status: variables.status }
          : o
      );
      dispatch(setOrders(updatedOrders));
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },

    onError: (error) => {
      dispatch(adminError(
        error.response?.data?.message || "Failed to update order!"
      ));
    },
  });
};

// ─── Cancel Order ─────────────────────────────────────────────
export const useCancelOrder = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const store = useStore();

  return useMutation({
    mutationFn: async (orderId) => {
      const response = await api.patch(`/admin/orders/${orderId}`, {
        status: "cancelled",
      });
      return response.data;
    },

    onSuccess: (_, orderId) => {
      dispatch(cancelOrder(orderId));

      const currentOrders = store.getState().orders?.orders ?? [];
      const updatedOrders = currentOrders.map((o) =>
        o.id === orderId || o._id === orderId
          ? { ...o, status: "cancelled" }
          : o
      );
      dispatch(setOrders(updatedOrders));
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },

    onError: (error) => {
      dispatch(adminError(
        error.response?.data?.message || "Failed to cancel order!"
      ));
    },
  });
};

// ─── Delete Product ───────────────────────────────────────────
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId) => {
      await api.delete(`/products/${productId}`);
      return productId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// ─── Add Product ──────────────────────────────────────────────
export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData) => {
      const response = await api.post("/products", productData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// ─── Update Product ───────────────────────────────────────────
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, productData }) => {
      const response = await api.put(
        `/products/${productId}`,
        productData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};