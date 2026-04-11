// src/components/product/ProductFilter.jsx

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  selectCategories,
  selectSelectedCategory,
  selectSortBy,
  selectSearchQuery,
  setSelectedCategory,
  setSortBy,
  setSearchQuery,
  resetFilters,
} from "../../features/products/productSlice";

const sortOptions = [
  { value: "default",    label: "Default" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
  { value: "name-asc",   label: "Name: A to Z" },
  { value: "name-desc",  label: "Name: Z to A" },
];

const ProductFilter = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(inputValue));
      
    }, 500);

    return () => clearTimeout(timer); // cleanup
  }, [inputValue, dispatch]);



  const categories = useSelector(selectCategories);
  const selectedCategory = useSelector(selectSelectedCategory);
  const sortBy = useSelector(selectSortBy);
  const searchQuery = useSelector(selectSearchQuery);

  // ─── Check if any filter is active ────────────────────
  const isFilterActive =
    searchQuery !== "" ||
    selectedCategory !== "All" ||
    sortBy !== "default";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-800">
          🔍 Filters
        </h2>
        {isFilterActive && (
          <button
            onClick={() => {
              setInputValue("");                 // clear input
              dispatch(resetFilters());          // reset filters
            }}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            Reset All
          </button>
        )}
      </div>

      {/* ── Search ──────────────────────────────────────── */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Search
        </label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
      </div>

      {/* ── Category Filter ──────────────────────────────── */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Category
        </label>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => dispatch(setSelectedCategory(category))}
              className={`text-left text-sm px-3 py-2 rounded-lg transition font-medium
                ${selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sort ────────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Sort By
        </label>
        <div className="flex flex-col gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => dispatch(setSortBy(option.value))}
              className={`text-left text-sm px-3 py-2 rounded-lg transition font-medium
                ${sortBy === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProductFilter;