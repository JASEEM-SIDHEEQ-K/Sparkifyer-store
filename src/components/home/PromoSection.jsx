// src/components/home/PromoSection.jsx

import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedCategory } from "../../features/products/productSlice";

const promos = [
  {
    id: 1,
    tag: "Limited Offer",
    title: "Up to 20% Off",
    subtitle: "On all Smartphones & Tablets",
    description: "Grab the latest phones at unbeatable prices. Limited stock available!",
    icon: "📱",
    bg: "from-blue-600 to-blue-800",
    category: "Smartphones",
    cta: "Shop Smartphones",
  },
  {
    id: 2,
    tag: "Weekend Deal",
    title: "Free Delivery",
    subtitle: "On orders above $50",
    description: "Shop your favorite gadgets and get free delivery straight to your door.",
    icon: "🚚",
    bg: "from-slate-700 to-slate-900",
    category: null,
    cta: "Shop Now",
  },
];

const PromoSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePromoClick = (category) => {
    if (category) {
      dispatch(setSelectedCategory(category));
    }
    navigate("/products", {
      state: { fromCategory: !!category },
    });
  };

  return (
    <section className="bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Section Header ────────────────────────────── */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Deals & Offers
          </h2>
          <p className="text-slate-500 text-sm">
            Don't miss out on these amazing deals
          </p>
        </div>

        {/* ── Promo Cards ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className={`bg-gradient-to-br ${promo.bg} text-white rounded-2xl p-6 flex flex-col justify-between gap-4 shadow-md`}
            >

              {/* Top Row */}
              <div className="flex items-start justify-between">

                {/* Content */}
                <div>
                  {/* Tag */}
                  <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {promo.tag}
                  </span>

                  {/* Title */}
                  <h3 className="text-2xl font-extrabold mb-1">
                    {promo.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-white/80 font-semibold text-sm mb-2">
                    {promo.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-white/60 text-xs max-w-xs">
                    {promo.description}
                  </p>
                </div>

                {/* Icon */}
                <span className="text-5xl opacity-80">
                  {promo.icon}
                </span>

              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePromoClick(promo.category)}
                className="w-fit bg-white text-slate-800 hover:bg-slate-100 font-bold text-sm px-6 py-2.5 rounded-xl transition"
              >
                {promo.cta} →
              </button>

            </div>
          ))}
        </div>

        {/* ── Features Row ──────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">

          <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-slate-200">
            <span className="text-2xl">🚚</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Free Delivery</p>
              <p className="text-xs text-slate-400">Orders over $50</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-slate-200">
            <span className="text-2xl">🔄</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Easy Returns</p>
              <p className="text-xs text-slate-400">30 day returns</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-slate-200">
            <span className="text-2xl">🛡️</span>
            <div>
              <p className="text-xs font-bold text-slate-800">2 Year Warranty</p>
              <p className="text-xs text-slate-400">On all products</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-slate-200">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Secure Payment</p>
              <p className="text-xs text-slate-400">100% protected</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PromoSection;