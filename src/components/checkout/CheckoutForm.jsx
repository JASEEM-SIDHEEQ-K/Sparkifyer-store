// src/components/checkout/CheckoutForm.jsx

import { useState } from "react";

const CheckoutForm = ({ onSubmit, isPending }) => {

  const [formData, setFormData] = useState({
    // ─── Shipping ────────────────────────────────────────
    name: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    // ─── Payment ─────────────────────────────────────────
    paymentMethod: "card",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  // ─── Real-time Validation ──────────────────────────────
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim().length < 3 ? "Full name is required!" : "";
      case "phone":
        return !/^\d{10}$/.test(value) ? "Enter valid 10 digit phone number!" : "";
      case "address":
        return value.trim().length < 5 ? "Address is required!" : "";
      case "city":
        return value.trim().length < 2 ? "City is required!" : "";
      case "zip":
        return !/^\d{5,6}$/.test(value) ? "Enter valid zip code!" : "";
      case "cardNumber":
        return !/^\d{16}$/.test(value.replace(/\s/g, ""))
          ? "Enter valid 16 digit card number!"
          : "";
      case "expiry":
        return !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)
          ? "Enter valid expiry (MM/YY)!"
          : "";
      case "cvv":
        return !/^\d{3}$/.test(value) ? "Enter valid 3 digit CVV!" : "";
      default:
        return "";
    }
  };

  // ─── Handle Change ─────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;

    // ── Format card number with spaces ──────────────────
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
      setFormData((prev) => ({ ...prev, cardNumber: formatted }));
      setErrors((prev) => ({
        ...prev,
        cardNumber: validateField("cardNumber", formatted),
      }));
      return;
    }

    // ── Format expiry MM/YY ──────────────────────────────
    if (name === "expiry") {
      const formatted = value
        .replace(/\D/g, "")
        .slice(0, 4)
        .replace(/^(\d{2})(\d)/, "$1/$2");
      setFormData((prev) => ({ ...prev, expiry: formatted }));
      setErrors((prev) => ({
        ...prev,
        expiry: validateField("expiry", formatted),
      }));
      return;
    }

    // ── CVV → numbers only ───────────────────────────────
    if (name === "cvv") {
      const formatted = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev) => ({ ...prev, cvv: formatted }));
      setErrors((prev) => ({
        ...prev,
        cvv: validateField("cvv", formatted),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  // ─── Handle Submit ─────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    // validate shipping fields
    const shippingFields = ["name", "phone", "address", "city", "zip"];

    // validate card fields only if payment is card
    const cardFields =
      formData.paymentMethod === "card"
        ? ["cardNumber", "expiry", "cvv"]
        : [];

    const allFields = [...shippingFields, ...cardFields];

    const submitErrors = {};
    allFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) submitErrors[field] = error;
    });

    setErrors(submitErrors);
    if (Object.keys(submitErrors).length > 0) return;

    // ── Pass form data to parent ─────────────────────────
    onSubmit({
      shippingAddress: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
      },
      paymentMethod: formData.paymentMethod,
    });
  };

  // ─── Input class helper ────────────────────────────────
  const inputClass = (field) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2
    ${errors[field]
      ? "border-red-400 focus:ring-red-300"
      : "border-slate-300 focus:ring-blue-400 focus:border-blue-400"
    }`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* ── Shipping Address ──────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-4">
          📦 Shipping Address
        </h2>

        <div className="flex flex-col gap-4">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={inputClass("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="1234567890"
              className={inputClass("phone")}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main Street"
              className={inputClass("address")}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          {/* City + Zip */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
                className={inputClass("city")}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="10001"
                className={inputClass("zip")}
              />
              {errors.zip && (
                <p className="text-red-500 text-xs mt-1">{errors.zip}</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Payment Method ────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-4">
          💳 Payment Method
        </h2>

        {/* Payment Options */}
        <div className="flex gap-3 mb-4">
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, paymentMethod: "card" }))
            }
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition
              ${formData.paymentMethod === "card"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
              }`}
          >
            💳 Credit / Debit Card
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, paymentMethod: "cod" }))
            }
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition
              ${formData.paymentMethod === "cod"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
              }`}
          >
            💵 Cash on Delivery
          </button>
        </div>

        {/* Card Fields */}
        {formData.paymentMethod === "card" && (
          <div className="flex flex-col gap-4">

            {/* Dummy card notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <p className="text-xs text-blue-600">
                🔒 This is a dummy payment — no real transaction will occur.
              </p>
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                className={inputClass("cardNumber")}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className={inputClass("expiry")}
                />
                {errors.expiry && (
                  <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  CVV
                </label>
                <input
                  type="password"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="***"
                  className={inputClass("cvv")}
                />
                {errors.cvv && (
                  <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* COD Notice */}
        {formData.paymentMethod === "cod" && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
            <p className="text-sm text-slate-600">
              💵 Pay when your order arrives at your doorstep.
            </p>
          </div>
        )}

      </div>

      {/* ── Place Order Button ────────────────────────────── */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed text-base"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Placing Order...
          </span>
        ) : (
          "✅ Place Order"
        )}
      </button>

    </form>
  );
};

export default CheckoutForm;