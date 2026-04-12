// src/components/common/SearchBar.jsx

import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  setSearchQuery,
  selectSearchQuery,
  resetFilters,
} from "../../features/products/productSlice";

const SearchBar = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);

  const reduxSearchQuery = useSelector(selectSearchQuery);
  const isOnProductsPage = location.pathname === "/products";

  // ✅ stable refs — never cause effect re-runs
  const dispatchRef = useRef(dispatch);
  const navigateRef = useRef(navigate);
  const isOnProductsPageRef = useRef(isOnProductsPage);

  // ✅ keep refs updated without triggering effects
  dispatchRef.current = dispatch;
  navigateRef.current = navigate;
  isOnProductsPageRef.current = isOnProductsPage;

  const [inputValue, setInputValue] = useState(
    isOnProductsPage ? reduxSearchQuery : ""
  );

  // ─── Auto focus when on products page with value ──────
  useEffect(() => {
    if (isOnProductsPage && inputValue.trim()) {
      inputRef.current?.focus();
    }
    // ✅ only runs when isOnProductsPage changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnProductsPage]);

  // ─── Clear input when leaving products page ───────────
  // ✅ use callback ref pattern to avoid setState in effect
  const clearInputRef = useRef(null);
  clearInputRef.current = () => {
    setInputValue("");
    dispatchRef.current(resetFilters());
  };

  useEffect(() => {
    if (!isOnProductsPageRef.current) {
      clearInputRef.current();
    }
    // ✅ only runs when pathname changes
  }, [location.pathname]);

  // ─── Debounce ─────────────────────────────────────────
  useEffect(() => {
    if (!inputValue.trim()) {
      dispatchRef.current(setSearchQuery(""));
      return;
    }

    const timer = setTimeout(() => {
      dispatchRef.current(setSearchQuery(inputValue));
      if (!isOnProductsPageRef.current) {
        navigateRef.current("/products", { state: { fromCategory: true } });
      }
    }, 400);

    return () => clearTimeout(timer);
    // ✅ only depends on inputValue — refs are stable
  }, [inputValue]);

  // ─── Handle Change ────────────────────────────────────
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  // ─── Handle Submit ────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch(setSearchQuery(inputValue));
      if (!isOnProductsPage) {
        navigate("/products", { state: { fromCategory: true } });
      }
    }
    onClose?.();
  };

  // ─── Handle Clear ─────────────────────────────────────
  const handleClear = useCallback(() => {
    setInputValue("");
    dispatchRef.current(setSearchQuery(""));
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <div className="relative flex-1">

        {/* Search Icon */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
          🔍
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Search products, brands..."
          className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-200 rounded-xl pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition"
        />

        {/* Clear Button */}
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white transition text-sm"
          >
            ✕
          </button>
        )}

      </div>
    </form>
  );
};

export default SearchBar;