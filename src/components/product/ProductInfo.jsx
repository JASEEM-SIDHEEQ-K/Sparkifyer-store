import { useState } from "react";
import QuantitySelector from "./QuantitySelector";

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  // ─── Discount Calculation ──────────────────────────────
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  // ─── Star Rating ───────────────────────────────────────
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={
          i < Math.floor(rating) ? "text-yellow-400" : "text-slate-300"
        }
      >
        ★
      </span>
    ));
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ── Category & Brand ──────────────────────────────── */}
      <div className="flex items-center gap-2">
        <span className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
          {product.category}
        </span>
        <span className="text-slate-400 text-xs">•</span>
        <span className="text-slate-500 text-xs font-medium">
          {product.brand}
        </span>
      </div>

      {/* ── Product Name ──────────────────────────────────── */}
      <h1 className="text-2xl font-bold text-slate-800 leading-snug">
        {product.name}
      </h1>

      {/* ── Rating & Reviews ──────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="flex text-lg">
          {renderStars(product.rating)}
        </div>
        <span className="text-sm font-semibold text-slate-700">
          {product.rating}
        </span>
        <span className="text-sm text-slate-400">
          ({product.reviews} reviews)
        </span>
      </div>

      {/* ── Price ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-slate-800">
          ${product.price}
        </span>
        {product.originalPrice > product.price && (
          <>
            <span className="text-lg text-slate-400 line-through">
              ${product.originalPrice}
            </span>
            <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          </>
        )}
      </div>

      {/* ── Description ───────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-1">
          Description
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* ── Tags ──────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <span
            key={tag}
            className="bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* ── Stock Status ──────────────────────────────────── */}
      <p className={`text-sm font-medium ${
        product.stock > 10
          ? "text-green-500"
          : product.stock > 0
          ? "text-orange-400"
          : "text-red-500"
      }`}>
        {product.stock > 10
          ? "✓ In Stock"
          : product.stock > 0
          ? `⚠ Only ${product.stock} items left`
          : "✗ Out of Stock"}
      </p>

      {/* ── Quantity Selector ─────────────────────────────── */}
      {product.stock > 0 && (
        <QuantitySelector
          quantity={quantity}
          onIncrease={() => setQuantity((prev) => prev + 1)}
          onDecrease={() => setQuantity((prev) => prev - 1)}
          stock={product.stock}
        />
      )}

      {/* ── Action Buttons ────────────────────────────────── */}
      <div className="flex gap-3 pt-2">

        {/* Add to Cart */}
        <button
          disabled={product.stock === 0}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? "Out of Stock" : "🛒 Add to Cart"}
        </button>

        {/* Wishlist */}
        <button
          className="w-12 h-12 flex items-center justify-center border border-slate-300 rounded-xl hover:border-blue-400 hover:text-blue-500 transition text-slate-400 text-xl"
        >
          ♡
        </button>

      </div>

      {/* ── Delivery Info ─────────────────────────────────── */}
      <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-2">
        <p className="text-xs text-slate-500 flex items-center gap-2">
          🚚 <span><span className="font-medium text-slate-700">Free delivery</span> on orders over $50</span>
        </p>
        <p className="text-xs text-slate-500 flex items-center gap-2">
          🔄 <span><span className="font-medium text-slate-700">Easy returns</span> within 30 days</span>
        </p>
        <p className="text-xs text-slate-500 flex items-center gap-2">
          🛡️ <span><span className="font-medium text-slate-700">2 year warranty</span> included</span>
        </p>
      </div>

    </div>
  );
};

export default ProductInfo;