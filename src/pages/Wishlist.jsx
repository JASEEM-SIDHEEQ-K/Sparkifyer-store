// src/pages/Wishlist.jsx

import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  selectWishlistItems,
  selectWishlistCount,
} from "../features/wishlist/wishlistSlice";
import { useGetWishlist } from "../features/wishlist/wishlistApi";
import WishlistItem from "../components/wishlist/WishlistItem";
import useAuth from "../hooks/useAuth";



const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate()

  const items = useSelector(selectWishlistItems);
  const count = useSelector(selectWishlistCount);

  // ─── Fetch wishlist on mount ───────────────────────────
  const { isLoading: isFetching } = useGetWishlist(user?.id);

  // ─── Loading State ─────────────────────────────────────
  if (isFetching && items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── Page Header ───────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            ❤️ My Wishlist
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {count > 0
              ? `${count} item${count > 1 ? "s" : ""} in your wishlist`
              : "Your wishlist is empty"}
          </p>
          <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition mb-6 font-medium"
            >
            <br/>
            ← Home
          </button>
        </div>

        {/* ── Empty State ───────────────────────────────── */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-6xl mb-4">❤️</p>
            <h2 className="text-xl font-bold text-slate-700 mb-2">
              Your wishlist is empty!
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Save items you love to your wishlist.
            </p>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium"
            >
              Explore Products
            </Link>
          </div>
        ) : (

          /* ── Wishlist Content ──────────────────────────── */
          <div className="flex flex-col gap-4">

            {/* ── Items Header ──────────────────────────── */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-600">
                {count} Item{count > 1 ? "s" : ""}
              </h2>
              <Link
                to="/products"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                + Add More
              </Link>
            </div>

            {/* ── Wishlist Items ────────────────────────── */}
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <WishlistItem
                  key={item.id}
                  item={item}
                />
              ))}
            </div>

            {/* ── Continue Shopping ─────────────────────── */}
            <Link
              to="/products"
              className="text-sm text-blue-600 hover:underline font-medium mt-2"
            >
              ← Continue Shopping
            </Link>

          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;