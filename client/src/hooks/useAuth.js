import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../features/auth/authSlice";
import { clearCart } from "../features/cart/cartSlice";
import { clearOrders } from "../features/checkout/orderSlice";
import { clearProfile } from "../features/auth/profileSlice";
import { clearWishlist } from '../features/wishlist/wishlistSlice'
import { clearAdmin } from "../features/admin/adminSlice";

import { useQueryClient } from "@tanstack/react-query"; 



const useAuth = () => {

    const dispatch=useDispatch()
    const navigate=useNavigate()

    const queryClient = useQueryClient();

    const { user,token,role,isLoading,error}=useSelector(state=>state.auth)

    const handleLogout = () =>{

      queryClient.clear();

      dispatch(logout())
      dispatch(clearCart())
      dispatch(clearOrders())
      dispatch(clearProfile())
      dispatch(clearWishlist())
      dispatch(clearAdmin());
      navigate("/login")
    }

  return {
    user,
    token,
    role,
    isLoading,
    error,
    isAuthenticated: !!token,
    isAdmin: role === 'admin',
    logout:handleLogout,              //  expose function
  }
}

export default useAuth
