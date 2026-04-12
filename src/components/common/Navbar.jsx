// src/components/common/Navbar.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { selectCartCount } from "../../features/cart/cartSlice";
import { selectWishlistCount } from "../../features/wishlist/wishlistSlice";
import { resetFilters } from "../../features/products/productSlice";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);

  return (
    <nav className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">

        {/* ── Main Row ──────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4">

          {/* ── Logo ──────────────────────────────────── */}
          <Link
            to="/"
            onClick={() => dispatch(resetFilters())}
            className="text-xl font-bold tracking-wide flex-shrink-0"
          >
            ⚡ Sparkifyer
          </Link>

          {/* ── Desktop Search ────────────────────────── */}
          <div className="hidden md:flex flex-1 max-w-md">
            <SearchBar />
          </div>

          {/* ── Desktop Menu ──────────────────────────── */}
          <div className="hidden md:flex items-center gap-4 text-sm font-medium flex-shrink-0">

            <Link to="/products" className="hover:text-blue-200 transition">
              Products
            </Link>

            {isAuthenticated && (
              <>
                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative hover:text-blue-200 transition"
                >
                  🛒 Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-white text-blue-700 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="relative hover:text-blue-200 transition"
                >
                  ❤️ Wishlist
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAdmin && (
              <Link to="/admin" className="hover:text-blue-200 transition">
                🛠️ Dashboard
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-full text-xs transition"
                >
                  👤 {user?.name}
                </Link>
                <button
                  onClick={logout}
                  className="bg-white text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hover:text-blue-200 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  Register
                </Link>
              </div>
            )}

          </div>

          {/* ── Mobile Right Icons ────────────────────── */}
          <div className="md:hidden flex items-center gap-3">

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white text-lg"
            >
              {searchOpen ? "✕" : "🔍"}
            </button>

            {/* Mobile Cart Badge */}
            {isAuthenticated && (
              <Link to="/cart" className="relative">
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-blue-700 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Hamburger */}
            <button
              className="text-white text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? "✕" : "☰"}
            </button>

          </div>

        </div>

        {/* ── Mobile Search Bar ─────────────────────────── */}
        {searchOpen && (
          <div className="md:hidden mt-3">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        )}

      </div>

      {/* ── Mobile Menu ──────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800 px-4 py-4 flex flex-col gap-3 text-sm font-medium">

          <Link
            to="/products"
            onClick={() => setMenuOpen(false)}
            className="hover:text-blue-200 transition"
          >
            Products
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="relative hover:text-blue-200 transition w-fit"
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-white text-blue-700 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="relative hover:text-blue-200 transition w-fit"
              >
                ❤️ Wishlist
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-200 transition"
            >
              🛠️ Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="hover:text-blue-200 transition"
              >
                👤 {user?.name}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="bg-white text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold w-fit"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="hover:text-blue-200 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-white text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold w-fit"
              >
                Register
              </Link>
            </>
          )}

        </div>
      )}

    </nav>
  );
};

export default Navbar;