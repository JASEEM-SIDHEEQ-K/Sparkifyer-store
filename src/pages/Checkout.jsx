// src/pages/Checkout.jsx

import { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  // selectCartSavings,
} from "../features/cart/cartSlice";
import { usePlaceOrder } from "../features/checkout/orderApi";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummary";
import useAuth from "../hooks/useAuth";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const isPlacingOrder = useRef(false);
  // const savings = useSelector(selectCartSavings);

  // ─── Delivery charge ──────────────────────────────────
  const FREE_DELIVERY = 50;
  const deliveryCharge = total >= FREE_DELIVERY ? 0 : 5.99;
  const finalTotal = total + deliveryCharge;

  // ─── Redirect if cart is empty ────────────────────────
  useEffect(() => {
    if (cartItems.length === 0 && !isPlacingOrder.current) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  // ─── TanStack Mutation ────────────────────────────────
  const { mutate: placeOrder, isPending, error } = usePlaceOrder();

  // ─── Handle Form Submit ───────────────────────────────
  const handlePlaceOrder = (formData) => {

    isPlacingOrder.current = true;

    placeOrder({
      orderData: {
        subtotal: total,
        deliveryCharge,
        total: finalTotal,
        paymentMethod: formData.paymentMethod,
        shippingAddress: formData.shippingAddress,
      },
      cartItems,
      userId: user?.id,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Page Header ───────────────────────────────── */}
        <div className="mb-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <span>›</span>
            <Link to="/cart" className="hover:text-blue-600 transition">
              Cart
            </Link>
            <span>›</span>
            <span className="text-slate-600 font-medium">Checkout</span>
          </nav>

          <h1 className="text-2xl font-bold text-slate-800">
            Checkout
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Complete your order below
          </p>
        </div>

        {/* ── Error Message ─────────────────────────────── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
            {error.message || "Failed to place order. Please try again!"}
          </div>
        )}

        {/* ── Main Content ──────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left → Checkout Form ──────────────────── */}
          <div className="flex-1">
            <CheckoutForm
              onSubmit={handlePlaceOrder}
              isPending={isPending}
            />
          </div>

          {/* ── Right → Order Summary ─────────────────── */}
          <div className="w-full lg:w-96 flex-shrink-0">

            <OrderSummary />

            {/* ── Steps indicator ───────────────────── */}
            <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-600 mb-3">
                Order Steps
              </p>
              <div className="flex flex-col gap-2">

                <div className="flex items-center gap-2 text-xs text-green-500">
                  <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center font-bold">
                    ✓
                  </span>
                  <span>Cart reviewed</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                  <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center font-bold">
                    2
                  </span>
                  <span>Shipping & Payment</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold">
                    3
                  </span>
                  <span>Order Confirmed</span>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;