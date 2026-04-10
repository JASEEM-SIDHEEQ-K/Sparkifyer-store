// src/components/home/CategorySection.jsx

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedCategory } from "../../features/products/productSlice";

const categories = [
  {
    name: "Smartphones",
    icon: "📱",
    color: "bg-blue-50 hover:bg-blue-100",
    iconBg: "bg-blue-100",
    textColor: "text-blue-700",
    count: "4 Products",
  },
  {
    name: "Laptops",
    icon: "💻",
    color: "bg-purple-50 hover:bg-purple-100",
    iconBg: "bg-purple-100",
    textColor: "text-purple-700",
    count: "2 Products",
  },
  {
    name: "Audio",
    icon: "🎧",
    color: "bg-green-50 hover:bg-green-100",
    iconBg: "bg-green-100",
    textColor: "text-green-700",
    count: "2 Products",
  },
  {
    name: "Cameras",
    icon: "📷",
    color: "bg-yellow-50 hover:bg-yellow-100",
    iconBg: "bg-yellow-100",
    textColor: "text-yellow-700",
    count: "2 Products",
  },
  {
    name: "Wearables",
    icon: "⌚",
    color: "bg-pink-50 hover:bg-pink-100",
    iconBg: "bg-pink-100",
    textColor: "text-pink-700",
    count: "2 Products",
  },
  {
    name: "Accessories",
    icon: "🖱️",
    color: "bg-orange-50 hover:bg-orange-100",
    iconBg: "bg-orange-100",
    textColor: "text-orange-700",
    count: "2 Products",
  },
  {
    name: "Gaming",
    icon: "🎮",
    color: "bg-red-50 hover:bg-red-100",
    iconBg: "bg-red-100",
    textColor: "text-red-700",
    count: "2 Products",
  },
];

const CategorySection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCategoryClick = (categoryName) => {
  dispatch(setSelectedCategory(categoryName));
  navigate("/products", {
    state: { fromCategory: true }  // ✅ flag
  });
};


  

  return (
    <section className="bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Section Header ────────────────────────────── */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Shop by Category
          </h2>
          <p className="text-slate-500 text-sm">
            Find exactly what you're looking for
          </p>
        </div>

        {/* ── Category Grid ─────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className={`${category.color} rounded-2xl p-4 flex flex-col items-center gap-2 transition cursor-pointer border border-transparent hover:border-slate-200 shadow-sm`}
            >

              {/* Icon */}
              <div className={`${category.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}>
                {category.icon}
              </div>

              {/* Name */}
              <p className={`text-xs font-bold ${category.textColor}`}>
                {category.name}
              </p>

              {/* Count */}
              <p className="text-xs text-slate-400">
                {category.count}
              </p>

            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;