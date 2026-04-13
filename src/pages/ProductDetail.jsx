import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetProductById } from "../features/products/productApi";
import ProductImages from "../components/product/ProductImages";
import ProductInfo from "../components/product/ProductInfo";




const ProductDetail = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();

 
  const { data: product, isLoading, isError } = useGetProductById(id);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  // ─── Error State ───────────────────────────────────────
  if (isError || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <p className="text-5xl">😕</p>
        <h2 className="text-xl font-bold text-slate-700">
          Product not found!
        </h2>
        <p className="text-slate-400 text-sm">
          The product you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const images =
    product.images?.length > 0
      ? product.images
      : [product.image];
  

  return (
    <div className="min-h-screen bg-slate-50">
      
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Breadcrumb ──────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <span>›</span>
          <Link to="/products" className="hover:text-blue-600 transition">
            Products
          </Link>
          <span>›</span>
          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-blue-600 transition"
          >
            {product.category}
          </Link>
          <span>›</span>
          <span className="text-slate-600 font-medium truncate max-w-xs capitalize">
            {slug
              ? slug.replace(/-/g, " ")
              : product.name                   // fallback to product name
            }
          </span>
        </nav>



        {/* ── Back Button ─────────────────────────────────── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition mb-6 font-medium"
        >
          ← Back
        </button>

        {/* ── Main Content ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left → Product Image */}
          <ProductImages
            images={images}
            name={product.name}
          />

          {/* Right → Product Info */}
          <ProductInfo product={product} />

        </div>

        {/* ── Related Products Section (placeholder) ──────── */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Related Products
          </h2>
          <p className="text-slate-400 text-sm">
            Coming soon...
          </p>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;