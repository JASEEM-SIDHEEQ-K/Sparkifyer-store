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


      //real time stock update
      await Promise.all(
        cartItems.map(async (item) => {
          // get current product
          const productRes = await api.get(
            `/products/${item.productId}`
          );
          const currentStock = productRes.data.stock;
          const newStock = Math.max(0, currentStock - item.quantity);

          // update stock
          await api.patch(`/products/${item.productId}`, {
            stock: newStock,
          });
        })
      );



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
      // save placed order
      dispatch(setCurrentOrder(placedOrder));

      queryClient.setQueryData(["products"], (oldProducts) => {
    if (!oldProducts) return oldProducts;

    return oldProducts.map((product) => {
      const item = variables.cartItems.find(
        (i) => i.productId === product.id
      );

      if (item) {
        return {
          ...product,
          stock: Math.max(0, product.stock - item.quantity),
        };
      }

      return product;
    });
  });
      


      if (variables.isBuyNow) {
        // Buy Now → clear buyNow item only
        dispatch(clearBuyNowItem());
      } else {
        // Normal checkout → clear cart
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
      dispatch(orderError(error.message || "Failed to place order!"));
    },
  });
};