import api from "../../services/api";
import {
  // cartLoading,
  setCartItems,
  // addCartItem,
  // updateCartItem,
  // removeCartItem,
  cartError,
} from "./cartSlice";

// ─── Fetch Cart ───────────────────────────────────────────────
export const fetchCart = () => async (dispatch) => {
  try {
    const response = await api.get("/cart");
    // backend returns { cart: { items: [...] } }
    dispatch(setCartItems(response.data.cart.items));
  } catch (error) {
    dispatch(cartError(error.response?.data?.message || "Failed to fetch cart!"));
  }
};

// ─── Add to Cart ──────────────────────────────────────────────
export const addToCart = (product) => async (dispatch) => {
  try {
    const response = await api.post("/cart", {
      productId: product.id,
      quantity: 1,
    });
    dispatch(setCartItems(response.data.cart.items));
  } catch (error) {
    dispatch(cartError(error.response?.data?.message || "Failed to add to cart!"));
  }
};

// ─── Add to Cart with Quantity (for Buy Now / ProductDetail) ──
export const addToCartWithQuantity =
  (product, userId, quantity) => async (dispatch) => {
    try {
      const response = await api.post("/cart", {
        productId: product.id,
        quantity,
      });
      dispatch(setCartItems(response.data.cart.items));
    } catch (error) {
      dispatch(cartError(error.response?.data?.message || "Failed to add to cart!"));
    }
  };


// ─── Update Cart Item Quantity ────────────────────────────────
export const updateCartQuantity =
  (cartItemId, quantity) => async (dispatch) => {
    try {
      const response = await api.put(`/cart/${cartItemId}`, {
        quantity,
      });
      dispatch(setCartItems(response.data.cart.items));
    } catch (error) {
      dispatch(cartError(error.response?.data?.message || "Failed to update cart!"));
    }
  };


// ─── Remove Cart Item ─────────────────────────────────────────
export const removeFromCart = (cartItemId) => async (dispatch) => {
  try {
    const response = await api.delete(`/cart/${cartItemId}`);
    dispatch(setCartItems(response.data.cart.items));
  } catch (error) {
    dispatch(cartError(error.response?.data?.message || "Failed to remove item!"));
  }
};