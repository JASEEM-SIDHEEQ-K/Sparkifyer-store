import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setProducts,
  selectFilteredProducts,
  selectSearchQuery,
  selectSelectedCategory,
  resetFilters,
} from "../features/products/productSlice";
import { useGetProducts } from "../features/products/productApi";
import ProductCard from "../components/product/ProductCard";
import ProductFilter from "../components/product/ProductFilter";

const ProductList = () => {
  const dispatch = useDispatch();
  const filteredProducts = useSelector(selectFilteredProducts);
  const searchQuery = useSelector(selectSearchQuery);
  const selectedCategory = useSelector(selectSelectedCategory);

  const [showFilter, setShowFilter] = useState(false);

  // ─── Fetch Products via TanStack Query ────────────────
  const { data, isLoading, isError } = useGetProducts();

  // ─── Load into Redux when data arrives ────────────────
  useEffect(() => {
    if (data) {
      dispatch(setProducts(data));
    }
  }, [data, dispatch]);

  // ─── Reset filters on page mount ──────────────────────
  useEffect(() => {
    dispatch(resetFilters());
  }, []);

  // ─── Loading State ────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────
  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold mb-2">
            Failed to load products!
          </p>
          <p className="text-slate-400 text-sm">
            Make sure JSON Server is running on port 3001
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Page Header ───────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            All Products
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {filteredProducts.length} products found
            {selectedCategory !== "All" && (
              <span className="text-blue-600 font-medium">
                {" "}in {selectedCategory}
              </span>
            )}
            {searchQuery && (
              <span className="text-blue-600 font-medium">
                {" "}for "{searchQuery}"
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-6">

          {/* ── Filter Sidebar (Desktop) ───────────────── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilter />
          </aside>

          {/* ── Main Content ──────────────────────────── */}
          <div className="flex-1">

            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 border border-slate-300 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition"
              >
                🔍 {showFilter ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            {/* Mobile Filter Panel */}
            {showFilter && (
              <div className="lg:hidden mb-4">
                <ProductFilter />
              </div>
            )}

            {/* ── Empty State ───────────────────────── */}
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  No products found
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => dispatch(resetFilters())}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (

              /* ── Product Grid ──────────────────────── */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;