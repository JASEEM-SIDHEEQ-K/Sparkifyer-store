// src/components/home/HeroBanner.jsx

import { Link } from "react-router-dom";

const HeroBanner = () => {
  return (
    <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-10">

        {/* ── Left Content ──────────────────────────────── */}
        <div className="flex-1 text-center lg:text-left">

          {/* Badge */}
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            ⚡ Next-Gen Tech Store
          </span>

          {/* Heading */}
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Ignite Your
            <span className="text-yellow-400"> Tech Life </span>
            with Sparkifyer
          </h1>

          {/* Subheading */}
          <p className="text-blue-100 text-base lg:text-lg mb-8 max-w-lg mx-auto lg:mx-0">
            Discover the latest smartphones, laptops, audio gear,
            and more — all at unbeatable prices.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link
              to="/products"
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-8 py-3 rounded-xl transition text-sm"
            >
              Shop Now →
            </Link>
            <Link
              to="/products"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-xl transition text-sm border border-white/20"
            >
              View Deals
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10 justify-center lg:justify-start">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-yellow-400">500+</p>
              <p className="text-xs text-blue-200">Products</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-yellow-400">50K+</p>
              <p className="text-xs text-blue-200">Customers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-yellow-400">4.8★</p>
              <p className="text-xs text-blue-200">Rating</p>
            </div>
          </div>

        </div>

        {/* ── Right Content ─────────────────────────────── */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="relative">

            {/* Main image */}
            <div className="w-72 h-72 lg:w-96 lg:h-96 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
              <span className="text-8xl">⚡</span>
            </div>

            {/* Floating card 1 */}
            <div className="absolute -top-4 -left-4 bg-white rounded-2xl px-4 py-2 shadow-lg">
              <p className="text-xs font-bold text-slate-800">🔥 Hot Deal</p>
              <p className="text-xs text-slate-500">iPhone 15 Pro</p>
              <p className="text-sm font-extrabold text-blue-600">$999</p>
            </div>

            {/* Floating card 2 */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-2 shadow-lg">
              <p className="text-xs font-bold text-slate-800">⭐ Top Rated</p>
              <p className="text-xs text-slate-500">Sony WH-1000XM5</p>
              <p className="text-sm font-extrabold text-blue-600">$349</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroBanner;