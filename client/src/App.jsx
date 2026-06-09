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

  useEffect(() => {
    const session = getSession();
    if (!session?.user?.id) return;

    // verify user still active via backend
    api.get("/auth/profile")
      .then((res) => {
        const user = res.data.user;

        if (!user.isActive) {
          dispatch(logout());
          dispatch(clearCart());
          dispatch(clearOrders());
          dispatch(clearProfile());
          dispatch(clearWishlist());
          clearSession();
          return;
        }

        dispatch(loginSuccess({
          user: session.user,
          token: session.token,
          role: session.role,
        }));

        if (session.role !== "admin") {
          dispatch(fetchCart());
          api.get("/wishlist")
            .then((res) =>
              dispatch(setWishlistItems(res.data.wishlist.items))
            )
            .catch(console.error);
        }
      })
      .catch(console.error);

  }, [dispatch]);

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