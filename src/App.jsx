// src/App.jsx

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/common/Navbar";
import { getSession } from "./utils/localStorage";
import { fetchCart } from "./features/cart/cartApi";
import { setWishlistItems } from "./features/wishlist/wishlistSlice";
import api from "./services/api";

function App() {
  const dispatch = useDispatch();

  //restore cart + wishlist on app startup / refresh
  useEffect(() => {
    const session = getSession();

    if (session?.user?.id) {
      const userId = session.user.id;

      // fetch cart
      dispatch(fetchCart(userId));

      // fetch wishlist
      api
        .get(`/wishlist?userId=${userId}`)
        .then((response) => {
          dispatch(setWishlistItems(response.data));
        })
        .catch((error) => {
          console.error("Failed to fetch wishlist:", error);
        });
    }
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <main>
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;