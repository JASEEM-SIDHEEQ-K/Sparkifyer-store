import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/common/Navbar";
import { getSession } from "./utils/localStorage";
import { fetchCart } from "./features/cart/cartApi";
import { setWishlistItems } from "./features/wishlist/wishlistSlice";
import api from "./services/api";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  const session = getSession();

  useEffect(() => {
    
    if (!session?.user?.id) return;

    const userId = session.user.id;
    const role = session.role;

    if (role === "user") {
      dispatch(fetchCart(userId));
      api
        .get(`/wishlist?userId=${userId}`)
        .then((res) => dispatch(setWishlistItems(res.data)))
        .catch((err) => console.error(err));
    }
    // admin data fetched by useGetDashboardStats in AdminDashboard
  }, [dispatch, session]);

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