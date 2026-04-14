import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth/authApi";
import {
  loginFail,
  clearError,
  selectIsLoading,
  selectError,
} from "../features/auth/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const serverError = useSelector(selectError);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});


  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim().length < 3 ? "Name must be at least 3 characters!" : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Enter a valid email!" : "";
      case "password":
        return value.length < 6 ? "Password must be at least 6 characters!" : "";
      case "confirmPassword":
        return value !== formData.password ? "Passwords do not match!" : "";
      default:
        return "";
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
    dispatch(clearError());
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword),
    };

    setErrors(submitErrors);
    if (Object.values(submitErrors).some((err) => err !== "")) return;

    try {
      

      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      navigate("/login");

    } catch (err) {
      dispatch(loginFail(err.toString()));
    }
  };

  // ─── UI ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-slate-200">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">⚡ Sparkifyer</h1>
          <p className="text-slate-500 mt-1 text-sm">Create your account</p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          
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
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2
                ${errors.name
                  ? "border-red-400 focus:ring-red-300"
                  : "border-slate-300 focus:ring-blue-400 focus:border-blue-400"
                }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@gmail.com"
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2
                ${errors.email
                  ? "border-red-400 focus:ring-red-300"
                  : "border-slate-300 focus:ring-blue-400 focus:border-blue-400"
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2
                ${errors.password
                  ? "border-red-400 focus:ring-red-300"
                  : "border-slate-300 focus:ring-blue-400 focus:border-blue-400"
                }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2
                ${errors.confirmPassword
                  ? "border-red-400 focus:ring-red-300"
                  : "border-slate-300 focus:ring-blue-400 focus:border-blue-400"
                }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-60 mt-2"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;