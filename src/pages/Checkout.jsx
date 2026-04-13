// src/pages/Checkout.jsx

import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
} from "../features/cart/cartSlice";
import {
  selectBuyNowItem,
} from "../features/checkout/orderSlice";
import { usePlaceOrder } from "../features/checkout/orderApi";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummary";
import useAuth from "../hooks/useAuth";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    mutate: placeOrder,
    isPending,
    error,
  }  = usePlaceOrder()

  // ✅ check mode from URL
  const [searchParams] = useSearchParams();
  const isBuyNow = searchParams.get("mode") === "buynow";

  const cartItems = useSelector(selectCartItems);
  const buyNowItem = useSelector(selectBuyNowItem);
  const cartTotal = useSelector(selectCartTotal);

  // ✅ decide which items to use
  const checkoutItems = isBuyNow
    ? buyNowItem ? [buyNowItem] : []
    : cartItems;

  // ✅ calculate correct total
  const checkoutTotal = isBuyNow
    ? buyNowItem
      ? buyNowItem.price * buyNowItem.quantity
      : 0
    : cartTotal;


  const FREE_DELIVERY = 50;
  const deliveryCharge = checkoutTotal >= FREE_DELIVERY ? 0 : 5.99;
  const finalTotal = checkoutTotal + deliveryCharge;

  const isOrderingRef = useRef(false);

  // ✅ redirect if no items
  useEffect(() => {
  if (isBuyNow && !buyNowItem && !isOrderingRef.current) {
    navigate("/products");    // ✅ only if NOT ordering
    return;
  }
  if (!isBuyNow && cartItems.length === 0 && !isOrderingRef.current) {
    navigate("/cart");
  }
}, [cartItems, buyNowItem, isBuyNow, navigate]);

// ✅ set flag before placing order
const handlePlaceOrder = (formData) => {
  isOrderingRef.current = true;   // ← prevents redirect

  placeOrder({
    orderData: {
      subtotal: checkoutTotal,
      deliveryCharge,
      total: finalTotal,
      paymentMethod: formData.paymentMethod,
      shippingAddress: formData.shippingAddress,
    },
    cartItems: checkoutItems,
    userId: user?.id,
    isBuyNow,
  });
};

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <span>›</span>
            {isBuyNow ? (
              <Link to="/products" className="hover:text-blue-600 transition">
                Products
              </Link>
            ) : (
              <Link to="/cart" className="hover:text-blue-600 transition">
                Cart
              </Link>
            )}
            <span>›</span>
            <span className="text-slate-600 font-medium">Checkout</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-800">
            {isBuyNow ? "⚡ Quick Checkout" : "Checkout"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Complete your order below
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
            {error.message || "Failed to place order. Please try again!"}
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left → Form */}
          <div className="flex-1">
            <CheckoutForm
              onSubmit={handlePlaceOrder}
              isPending={isPending}
            />
          </div>

          {/* Right → Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <OrderSummary
              items={checkoutItems}
              total={checkoutTotal}
              deliveryCharge={deliveryCharge}
              finalTotal={finalTotal}
            />

            {/* Steps */}
            <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-600 mb-3">
                Order Steps
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-green-500">
                  <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center font-bold">
                    ✓
                  </span>
                  <span>
                    {isBuyNow ? "Product selected" : "Cart reviewed"}
                  </span>
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