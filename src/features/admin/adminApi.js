// src/features/admin/adminApi.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import {
  setStats,
  setRecentOrders,
  setTopProducts,
  setAllOrders,
  setAllUsers,
  setAllProducts,
  updateOrderStatus,
  deleteProduct,
  cancelOrder,
  adminError,
} from "./adminSlice";

import { setOrders } from "../checkout/orderSlice";

// ─── Fetch Dashboard Stats ────────────────────────────────────
export const useGetDashboardStats = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      // fetch all data in parallel
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        api.get("/products"),
        api.get("/orders"),
        api.get("/users"),
      ]);

      const products = productsRes.data;
      const orders = ordersRes.data;
      const users = usersRes.data;

      // ─── Calculate stats ──────────────────────────────
      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.total || 0),
        0
      );

      const stats = {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.filter((u) => u.role === "user").length,
        totalRevenue,
      };

      // ─── Recent orders → last 5 ───────────────────────
      const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // ─── Top products → by order frequency ───────────
      const productOrderCount = {};
      orders.forEach((order) => {
        order.items?.forEach((item) => {
          const id = item.productId;
          productOrderCount[id] = (productOrderCount[id] || 0) + item.quantity;
        });
      });

      const topProducts = products
        .map((p) => ({
          ...p,
          totalSold: productOrderCount[p.id] ||
            productOrderCount[String(p.id)] || 0,
        }))
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 5);

      // ─── Dispatch to Redux ────────────────────────────
      dispatch(setStats(stats));
      dispatch(setRecentOrders(recentOrders));
      dispatch(setTopProducts(topProducts));
      dispatch(setAllOrders(orders));
      dispatch(setAllUsers(users));
      dispatch(setAllProducts(products));

      return { stats, recentOrders, topProducts, orders, users, products };
    },
    staleTime: 1000 * 60 * 2,    // cache 2 mins
    retry: 1,
  });
};

// ─── Update Order Status ──────────────────────────────────────
export const useUpdateOrderStatus = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await api.patch(`/orders/${orderId}`, { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      dispatch(updateOrderStatus({
        orderId: variables.orderId,
        status: variables.status,
      }));
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
    onError: (error) => {
      dispatch(adminError(error.message || "Failed to update order status!"));
    },
  });
};


export const useCancelOrder = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId) => {
      const response = await api.patch(`/orders/${orderId}`, {
        status: "cancelled",
      });
      return response.data;
    },
    onSuccess: (_, orderId) => {
      // ✅ update adminSlice
      dispatch(cancelOrder(orderId));

      // ✅ update orderSlice too → user side reflects change
      dispatch(setOrders(
        // we need to get current orders from store
        // use queryClient to refetch instead
      ));

      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] }); // ✅ refetch user orders
    },
    onError: (error) => {
      dispatch(adminError(error.message || "Failed to cancel order!"));
    },
  });
};

// ─── Delete Product ───────────────────────────────────────────
export const useDeleteProduct = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId) => {
      await api.delete(`/products/${productId}`);
      return productId;
    },
    onSuccess: (productId) => {
      dispatch(deleteProduct(productId));
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      dispatch(adminError(error.message || "Failed to delete product!"));
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
      const response = await api.patch(`/products/${productId}`, productData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};