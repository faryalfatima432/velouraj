import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiLock,
  FiMail,
  FiShoppingBag,
} from "react-icons/fi";

import API from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post(
        "/auth/login",
        formData
      );

      const { token, user } = response.data;

      console.log("LOGIN USER:", user);

      // Check admin role
      if (user.role !== "admin") {
        setError(
          "This account does not have admin access."
        );

        return;
      }

      // Save admin token
      localStorage.setItem(
        "adminToken",
        token
      );

      // Save admin user
      localStorage.setItem(
        "admin",
        JSON.stringify(user)
      );

      // Go to admin dashboard
      navigate("/admin");
    } catch (error) {
      console.error(
        "ADMIN LOGIN ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <FiShoppingBag size={30} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            ShopHub
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Admin Dashboard
          </p>

        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">

          {/* Heading */}
          <div className="mb-6">

            <h2 className="text-2xl font-bold text-slate-900">
              Welcome back
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sign in to manage your store
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>

              <div className="relative">

                <FiMail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@shophub.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
                >
                  Forgot Password?
                </Link>

              </div>

              <div className="relative">

                <FiLock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          ShopHub Admin Panel
        </p>

      </div>

    </div>
  );
}

export default Login;