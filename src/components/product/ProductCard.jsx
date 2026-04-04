// src/components/product/ProductCard.jsx

import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {

  // ─── Discount Percentage ────────────────────────────────
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  // ─── Star Rating ────────────────────────────────────────
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition duration-200 flex flex-col">

      {/* ── Product Image ─────────────────────────────────── */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-2xl"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}

        {/* Out of Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 rounded-t-2xl flex items-center justify-center">
            <span className="bg-white text-slate-700 text-sm font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── Product Info ──────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1">

        {/* Category & Brand */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-blue-600 font-medium">
            {product.category}
          </span>
          <span className="text-xs text-slate-400">
            {product.brand}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-slate-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-sm">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-slate-400">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-slate-800">
            ${product.price}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-slate-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <p className={`text-xs mb-3 ${
          product.stock > 10
            ? "text-green-500"
            : product.stock > 0
            ? "text-orange-400"
            : "text-red-500"
        }`}>
          {product.stock > 10
            ? "✓ In Stock"
            : product.stock > 0
            ? `⚠ Only ${product.stock} left`
            : "✗ Out of Stock"}
        </p>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto">

          {/* View Details */}
          <Link
            to={`/products/${product.id}`}
            className="flex-1 text-center border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-semibold py-2 rounded-lg transition"
          >
            View Details
          </Link>

          {/* Add to Cart */}
          <button
            disabled={product.stock === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>

        </div>
      </div>
    </div>
  );
};

export default ProductCard;