import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../features/auth/authSlice";
import { clearCart } from "../features/cart/cartSlice";
import { clearOrders } from "../features/checkout/orderSlice";
import { clearProfile } from "../features/auth/profileSlice";



const useAuth = () => {

    const dispatch=useDispatch()
    const navigate=useNavigate()

    const { user,token,role,isLoading,error}=useSelector(state=>state.auth)

    const handleLogout = () =>{
      dispatch(logout())
      dispatch(clearCart())
      dispatch(clearOrders())
      dispatch(clearProfile())
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
