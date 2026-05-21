import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/common/Navbar";
import { getSession, clearSession } from "./utils/localStorage";
import { loginSuccess, logout } from "./features/auth/authSlice";
import { fetchCart } from "./features/cart/cartApi";
import { setWishlistItems } from "./features/wishlist/wishlistSlice";
import { clearCart } from "./features/cart/cartSlice";
import { clearOrders } from "./features/checkout/orderSlice";
import { clearProfile } from "./features/auth/profileSlice";
import { clearWishlist } from "./features/wishlist/wishlistSlice";
import api from "./services/api";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  const session = getSession();

  useEffect(() => {
  if (!session?.user?.id) return;

  const userId = session.user.id;
  
  //Fetch latest user data from backend
  api
    .get(`/users/${userId}`)
    .then((res) => {
      const user = res.data;

      //If admin deactivated the user → force logout
      if (user.isActive === false) {
        dispatch(logout());
        dispatch(clearCart());
        dispatch(clearOrders());
        dispatch(clearProfile());
        dispatch(clearWishlist());
        clearSession();
        return;
      }

      dispatch(
        loginSuccess({
          user: session.user,
          token: session.token,
          role: session.role,
        })
      );

      if (session.role === "user") {
        dispatch(fetchCart(userId));

        api
          .get(`/wishlist?userId=${userId}`)
          .then((res) => dispatch(setWishlistItems(res.data)))
          .catch((err) => console.error(err));
      }
    })
    .catch((err) => {
      console.error(err);
      dispatch(logout());
      clearSession();
    });
}, [dispatch,session]);

  return (
    <div>
      {!isAdminPage && <Navbar />}
      <main>
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;