// src/features/cart/cartApi.js

import api from "../../services/api";
import {
  cartLoading,
  setCartItems,
  addCartItem,
  updateCartItem,
  removeCartItem,
  cartError,
} from "./cartSlice";

// ─── Fetch Cart by UserId ─────────────────────────────────────
export const fetchCart = (userId) => async (dispatch) => {
  try {
    dispatch(cartLoading());
    const response = await api.get(`/cart?userId=${userId}`);
    dispatch(setCartItems(response.data));
  } catch (error) {
    dispatch(cartError(error.message || "Failed to fetch cart!"));
  }
};

// ─── Add to Cart ──────────────────────────────────────────────
export const addToCart = (product, userId) => async (dispatch, getState) => {
  try {
    dispatch(cartLoading());

    const { cart } = getState();

    // Check if product already exists in cart
    const existingItem = cart.items.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      // ── Product exists → update quantity ──────────────
      const newQuantity = existingItem.quantity + 1;

      // Don't exceed stock
      if (newQuantity > product.stock) {
        dispatch(cartError(`Only ${product.stock} items available!`));
        return;
      }

      await api.patch(`/cart/${existingItem.id}`, {
        quantity: newQuantity,
      });

      dispatch(updateCartItem({ id: existingItem.id, quantity: newQuantity }));

    } else {
      // ── Product not in cart → add new item ────────────
      const newItem = {
        userId,
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        quantity: 1,
        stock: product.stock,
      };

      const response = await api.post("/cart", newItem);
      dispatch(addCartItem(response.data));
    }

  } catch (error) {
    dispatch(cartError(error.message || "Failed to add to cart!"));
  }
};

// ─── Add to Cart with Quantity (for Buy Now / ProductDetail) ──
export const addToCartWithQuantity =
  (product, userId, quantity) => async (dispatch, getState) => {
    try {
      dispatch(cartLoading());

      const { cart } = getState();

      const existingItem = cart.items.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > product.stock) {
          dispatch(cartError("Cannot add more than available stock!"));
          return;
        }

        await api.patch(`/cart/${existingItem.id}`, {
          quantity: newQuantity,
        });

        dispatch(
          updateCartItem({ id: existingItem.id, quantity: newQuantity })
        );

      } else {
        const newItem = {
          userId,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          quantity,
          stock: product.stock,
        };

        const response = await api.post("/cart", newItem);
        dispatch(addCartItem(response.data));
      }

    } catch (error) {
      dispatch(cartError(error.message || "Failed to add to cart!"));
    }
  };

// ─── Update Cart Item Quantity ────────────────────────────────
export const updateCartQuantity =
  (cartItemId, quantity) => async (dispatch) => {
    try {
      await api.patch(`/cart/${cartItemId}`, {  // ✅ no Number()
        quantity,
      });
      dispatch(updateCartItem({ id: cartItemId, quantity }));
    } catch (error) {
      dispatch(cartError(error.message || "Failed to update quantity!"));
    }
  };

// ─── Remove Cart Item ─────────────────────────────────────────
export const removeFromCart = (cartItemId) => async (dispatch) => {
  try {
    await api.delete(`/cart/${cartItemId}`);    // ✅ no Number()
    dispatch(removeCartItem(cartItemId));
  } catch (error) {
    dispatch(cartError(error.message || "Failed to remove item!"));
  }
};