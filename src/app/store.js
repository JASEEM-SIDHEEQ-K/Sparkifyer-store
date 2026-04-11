import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import productReducer from '../features/products/productSlice'
import cartReducer from '../features/cart/cartSlice'
import orderReducer from '../features/checkout/orderSlice'
import profileReducer from "../features/auth/profileSlice";
import wishlistReducer from '../features/wishlist/wishlistSlice'

export const store = configureStore({
    reducer:{
        auth: authReducer,
        products:productReducer,
        cart:cartReducer,
        orders:orderReducer,
        profile: profileReducer,
        wishlist: wishlistReducer,
    }
})
