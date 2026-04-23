import { useState } from "react";

const categories = [
  "Smartphones",
  "Laptops",
  "Audio",
  "Cameras",
  "Wearables",
  "Accessories",
  "Gaming",
];

const initialForm = {
  name: "",
  category: "Smartphones",
  brand: "",
  price: "",
  originalPrice: "",
  stock: "",
  rating: "",
  reviews: "",
  description: "",
  image: "",
  tags: "",
};

const AdminProductForm = ({ product, onSubmit, onClose, isPending }) => {
  const isEdit = !!product;

  const [formData, setFormData] = useState(() => {
    if (product) {
      return {
        name: product.name || "",
        category: product.category || "Smartphones",
        brand: product.brand || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        stock: product.stock || "",
        rating: product.rating || "",
        reviews: product.reviews || "",
        description: product.description || "",
        image: product.image || "",
        tags: product.tags?.join(", ") || "",
      };
    }
    return initialForm;
  });

  const [errors, setErrors] = useState({});

  // ─── Validation ───────────────────────────────────────
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return !value.trim() ? "Product name is required!" : "";
      case "brand":
        return !value.trim() ? "Brand is required!" : "";
      case "price":
        return !value || isNaN(value) || Number(value) <= 0
          ? "Valid price is required!"
          : "";
      case "originalPrice":
        return !value || isNaN(value) || Number(value) <= 0
          ? "Valid original price is required!"
          : "";
      case "stock":
        return !value || isNaN(value) || Number(value) < 0
          ? "Valid stock is required!"
          : "";
      case "description":
        return !value.trim() ? "Description is required!" : "";
      case "image":
        return !value.trim() ? "Image URL is required!" : "";
      default:
        return "";
    }
  };

  // ─── Handle Change ────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  // ─── Handle Submit ────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "name", "brand", "price",
      "originalPrice", "stock", "description", "image",
    ];

    const submitErrors = {};
    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) submitErrors[field] = error;
    });

    setErrors(submitErrors);
    if (Object.keys(submitErrors).length > 0) return;

    // build product data
    const productData = {
      name: formData.name.trim(),
      category: formData.category,
      brand: formData.brand.trim(),
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      stock: Number(formData.stock),
      rating: Number(formData.rating) || 0,
      reviews: Number(formData.reviews) || 0,
      description: formData.description.trim(),
      image: formData.image.trim(),
      images: [formData.image.trim()],
      tags: formData.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      isActive: true,
    };

    onSubmit(productData);
  };

  // ─── Input class ──────────────────────────────────────
  const inputClass = (field) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition
    ${errors[field]
      ? "border-red-400 focus:ring-red-300"
      : "border-slate-300 focus:ring-blue-400 focus:border-blue-400"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* ── Modal Header ──────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-base font-bold text-slate-800">
            {isEdit ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 transition text-slate-500"
          >
            ✕
          </button>
        </div>

        {/* ── Form ──────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

          {/* Row 1 → Name + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                className={inputClass("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass("category")}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Row 2 → Brand + Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Brand"
                className={inputClass("brand")}
              />
              {errors.brand && (
                <p className="text-red-500 text-xs mt-1">{errors.brand}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className={inputClass("stock")}
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
              )}
            </div>

          </div>

          {/* Row 3 → Price + Original Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className={inputClass("price")}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Original Price ($) *
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className={inputClass("originalPrice")}
              />
              {errors.originalPrice && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.originalPrice}
                </p>
              )}
            </div>

          </div>

          {/* Row 4 → Rating + Reviews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Rating (0-5)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="4.5"
                min="0"
                max="5"
                step="0.1"
                className={inputClass("rating")}
              />
            </div>

            {/* Reviews */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Reviews Count
              </label>
              <input
                type="number"
                name="reviews"
                value={formData.reviews}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className={inputClass("reviews")}
              />
            </div>

          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Image URL *
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://picsum.photos/seed/product/600/400"
              className={inputClass("image")}
            />
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}
            {/* Image Preview */}
            {formData.image && (
              <img
                src={formData.image}
                alt="preview"
                className="w-20 h-20 object-cover rounded-xl mt-2 border border-slate-200"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description..."
              rows={3}
              className={inputClass("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tags
              <span className="text-slate-400 font-normal ml-1">
                (comma separated)
              </span>
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="apple, iphone, smartphone, 5g"
              className={inputClass("tags")}
            />
          </div>

          {/* ── Action Buttons ──────────────────────────── */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-60"
            >
              {isPending
                ? isEdit ? "Saving..." : "Adding..."
                : isEdit ? "Save Changes" : "Add Product"
              }
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium py-2.5 rounded-xl transition"
            >
              Cancel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AdminProductForm;