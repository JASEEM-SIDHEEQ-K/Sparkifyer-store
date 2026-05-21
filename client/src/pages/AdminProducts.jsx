import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllProducts,
  selectAdminLoading,
  setAllProducts,
} from "../features/admin/adminSlice";
import {
  useAddProduct,
  useUpdateProduct,
} from "../features/admin/adminApi";

import AdminProductCard from "../components/admin/AdminProductCard";
import AdminProductForm from "../components/admin/AdminProductForm";
import api from "../services/api";

const categories = [
  "All",
  "Smartphones",
  "Laptops",
  "Audio",
  "Cameras",
  "Wearables",
  "Accessories",
  "Gaming",
];

const ITEMS_PER_PAGE = 8;

const AdminProducts = () => {
  const dispatch = useDispatch();
  const allProducts = useSelector(selectAllProducts);
  const isLoading = useSelector(selectAdminLoading);

  const [currentPage, setCurrentPage] = useState(1);


  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showInactive, setShowInactive] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [duplicateError, setDuplicateError] = useState("");



  // ─── Mutations ──────────────────────────────────────── api call
  const { mutate: addProduct, isPending: isAdding } = useAddProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();




  // ─── Filter products ──────────────────────────────────
  const filteredProducts = useMemo(() => {
  return allProducts.filter((p) => {
    const matchCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = showInactive ? true : p.isActive !== false;

    return matchCategory && matchSearch && matchStatus;
  });
}, [allProducts, selectedCategory, searchQuery, showInactive]);



  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // reset page on filter change
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleToggleInactive = () => {
    setShowInactive(!showInactive);
    setCurrentPage(1);
  };





  // ─── Handle Add Product ───────────────────────────────
  const handleAddProduct = (productData) => {
    setDuplicateError("");



    // prevent duplicate by name
    const isDuplicate = allProducts.some(
      (p) => p.name.toLowerCase() === productData.name.toLowerCase()
    );

    if (isDuplicate) {
      setDuplicateError(
        `Product "${productData.name}" already exists!`
      );
      return;
    }

    addProduct(productData, {
      onSuccess: () => {
        setShowForm(false);
        setDuplicateError("");
      },
    });
  };



  // ─── Handle Edit Product ──────────────────────────────
  const handleEditProduct = (productData) => {
    updateProduct(
      {
        productId: editProduct.id,
        productData,
      },
      {
        onSuccess: () => {
          setEditProduct(null);
          setShowForm(false);
        },
      }
    );
  };





  // ─── (Soft Delete) ───────────────
  const handleToggleStatus = async (product) => {
    try {
      await api.patch(`/products/${product.id}`, {
        isActive: !product.isActive,
      });

      // update Redux directly
      const updatedProducts = allProducts.map((p) =>
        p.id === product.id ? { ...p, isActive: !product.isActive } : p
      );
      dispatch(setAllProducts(updatedProducts));

    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };



  // ─── Open Edit Form ───────────────────────────────────
  const handleOpenEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
    setDuplicateError("");
  };

  // ─── Close Form ───────────────────────────────────────
  const handleCloseForm = () => {
    setShowForm(false);
    setEditProduct(null);
    setDuplicateError("");
  };



 
  const activeCount = allProducts.filter(
    (p) => p.isActive !== false
  ).length;
  const inactiveCount = allProducts.filter(
    (p) => p.isActive === false
  ).length;



  return (
    <div className="flex flex-col gap-6">

      {/* ── Page Header ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Products
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {activeCount} active
            {inactiveCount > 0 && (
              <span className="text-red-400 ml-1">
                · {inactiveCount} inactive
              </span>
            )}
          </p>
        </div>



        {/* Add Product Button */}
        <button
          onClick={() => {
            setEditProduct(null);
            setShowForm(true);
            setDuplicateError("");
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition text-sm"
        >
          ➕ Add Product
        </button>
      </div>



      {/* ── Filters Row ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Show Inactive Toggle */}
        <button
          onClick={handleToggleInactive}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition
            ${showInactive
              ? "bg-slate-800 text-white border-slate-800"
              : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
            }`}
        >
          {showInactive ? "👁 Showing All" : "👁 Show Inactive"}
        </button>

      </div>

      {/* ── Category Tabs ─────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition
              ${selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 border border-slate-300 hover:border-blue-400 hover:text-blue-600"
              }`}
          >
            {cat}
            {cat !== "All" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({allProducts.filter(
                  (p) => p.category === cat && p.isActive !== false
                ).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Duplicate Error ───────────────────────────── */}
      {duplicateError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          ⚠️ {duplicateError}
        </div>
      )}

      {/* ── Products List ─────────────────────────────── */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📦</p>
          <h3 className="text-base font-semibold text-slate-700 mb-1">
            No products found
          </h3>
          <p className="text-slate-400 text-sm">
            Try changing the category or search query
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {paginatedProducts.map((product) => (
            <AdminProductCard
              key={product.id}
              product={product}
              onEdit={handleOpenEdit}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 mt-2">

          <p className="text-xs text-slate-400">
            Showing{" "}
            {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}{" "}
            of {filteredProducts.length} products
          </p>

          <div className="flex items-center gap-1">

            {/* Previous */}
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 text-slate-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ‹
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition
            ${currentPage === page
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "border border-slate-300 text-slate-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600"
                  }`}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 text-slate-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ›
            </button>
          </div>
        </div>
      )}





      {/* ── Product Form Modal ────────────────────────── */}
      {showForm && (
        <AdminProductForm
          product={editProduct}
          onSubmit={editProduct ? handleEditProduct : handleAddProduct}
          onClose={handleCloseForm}
          isPending={isAdding || isUpdating}
        />
      )}

    </div>
  );
};

export default AdminProducts;