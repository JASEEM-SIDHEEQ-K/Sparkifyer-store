import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { loginUser } from "../features/auth/authApi";


import useAuth from "../hooks/useAuth";
import {
  loginStart,
  loginSuccess,
  loginFail,
  clearError,
  selectIsLoading,
  selectError,
} from "../features/auth/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const serverError = useSelector(selectError);
  
  const { isAuthenticated, role } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  
  if (isAuthenticated) {
    return <Navigate to={role === "admin" ? "/admin" : "/"} replace />;
  }

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Enter a valid email!"
          : "";
      case "password":
        return value.length < 6
          ? "Password must be at least 6 characters!"
          : "";
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
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(submitErrors);
    if (Object.values(submitErrors).some((err) => err !== "")) return;

    try {
      dispatch(loginStart());

      const sessionData = await loginUser(formData);
      dispatch(loginSuccess(sessionData));



      // role-based redirect
      if (sessionData.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (err) {
      dispatch(loginFail(err.toString()));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-slate-200">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">⚡ Sparkifyer</h1>
          <p className="text-slate-500 mt-1 text-sm">Login to your account</p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

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
              placeholder="Enter your password"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-60 mt-2"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;