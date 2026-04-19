// src/components/admin/AdminProductCard.jsx

const AdminProductCard = ({ product, onEdit, onToggleStatus }) => {

  // ─── Discount ─────────────────────────────────────────
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className={`bg-white border rounded-2xl p-4 shadow-sm flex gap-4 transition
      ${!product.isActive ? "opacity-60 border-slate-200" : "border-slate-200 hover:shadow-md"}`}
    >

      {/* ── Product Image ──────────────────────────────── */}
      <div className="relative flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-xl"
        />
        {/* Inactive badge */}
        {!product.isActive && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            Off
          </span>
        )}
      </div>

      {/* ── Product Info ───────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Name + Category */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 truncate">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-blue-600 font-medium">
                {product.category}
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-slate-400">
                {product.brand}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0
            ${product.isActive
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-500"
            }`}
          >
            {product.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Price + Stock */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-slate-800">
              ${product.price}
            </span>
            {discount > 0 && (
              <>
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice}
                </span>
                <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <span className="text-slate-200">|</span>

          {/* Stock */}
          <span className={`text-xs font-medium
            ${product.stock > 10
              ? "text-green-500"
              : product.stock > 0
              ? "text-orange-400"
              : "text-red-500"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock"}
          </span>

          <span className="text-slate-200">|</span>

          {/* Rating */}
          <span className="text-xs text-slate-500">
            ⭐ {product.rating}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-3">

          {/* Edit */}
          <button
            onClick={() => onEdit(product)}
            className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-xl transition"
          >
            ✏️ Edit
          </button>

          {/* Toggle Status */}
          <button
            onClick={() => onToggleStatus(product)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition
              ${product.isActive
                ? "bg-red-50 hover:bg-red-100 text-red-500"
                : "bg-green-50 hover:bg-green-100 text-green-600"
              }`}
          >
            {product.isActive ? "🚫 Deactivate" : "✅ Activate"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default AdminProductCard;