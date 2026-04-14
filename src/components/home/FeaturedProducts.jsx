import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAllProducts } from "../../features/products/productSlice";
import ProductCard from "../product/ProductCard";
import { useGetProducts } from "../../features/products/productApi";
import { useDispatch } from "react-redux";
import { setProducts } from "../../features/products/productSlice";
import { useEffect } from "react";

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const allProducts = useSelector(selectAllProducts);

  // ─── Fetch products if not loaded ─────────────────────
  const { data, isLoading } = useGetProducts();

  useEffect(() => {
    if (data) {
      dispatch(setProducts(data));
    }
  }, [data, dispatch]);

  // ─── Get top rated products ────────────────────────────
  const featuredProducts = [...allProducts]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Section Header ────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              Featured Products
            </h2>
            <p className="text-slate-500 text-sm">
              Top rated picks just for you
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm text-blue-600 font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>

        {/* ── Loading ───────────────────────────────────── */}
        {isLoading && allProducts.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-slate-100 rounded-2xl h-72 animate-pulse"
              />
            ))}
          </div>
        ) : (

          /* ── Products Grid ──────────────────────────── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedProducts;