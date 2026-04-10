

import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { selectCartCount } from "../../features/cart/cartSlice";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useSelector(selectCartCount);

  return (
    <nav className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

       
        <Link to="/" className="text-xl font-bold tracking-wide">
          ⚡ Sparkifyer
        </Link>

        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">

          <Link to="/products" className="hover:text-blue-200 transition">
            Products
          </Link>

          {isAuthenticated && (
            <>
              {/* ✅ Cart with badge */}
              <Link
                to="/cart"
                className="relative hover:text-blue-200 transition"
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 px-2 h-[18px] bg-blue-600 text-white text-[10px] font-semibold rounded-full flex items-center justify-center shadow">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              <Link to="/wishlist" className="hover:text-blue-200 transition">
                ❤️ Wishlist
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="hover:text-blue-200 transition"
            >
              🛠️ Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* User Info */}
              <span className="bg-blue-600 px-3 py-1 rounded-full text-xs">
                👤 {user?.name}
              </span>
              {/* Logout */}
              <button
                onClick={logout}
                className="bg-white text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hover:text-blue-200 transition"
              >
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

        {/* ── Mobile Hamburger ───────────────────────────── */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>




      {/* ── Mobile Menu ────────────────────────────────────── */}
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
              {/*  Mobile Cart with badge */}
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="relative hover:text-blue-200 transition w-fit"
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="hover:text-blue-200 transition"
              >
                ❤️ Wishlist
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
              <span className="text-blue-300 text-xs">
                👤 {user?.name}
              </span>
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