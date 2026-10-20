import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaFacebookF,
  FaGoogle,
  FaShieldAlt,
} from "react-icons/fa";

import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const message = new URLSearchParams(window.location.search).get("oauthError");
    if (message) setError(message);
  }, []);

  const startSocialLogin = (provider) => {
    window.location.href = `${API.defaults.baseURL}/auth/${provider}`;
  };

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(formData);

      navigate(from, { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shop-page-enter relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-[#f4f7f3] px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(23,99,58,0.14),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(23,99,58,0.08),transparent_42%)]" />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl lg:grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-[#17633a] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-2xl font-black tracking-tight">Shop<span className="text-[#c5e5ce]">Hub</span></p>
            <p className="mt-16 text-sm font-semibold uppercase tracking-[0.24em] text-[#c5e5ce]">Your everyday store</p>
            <h2 className="mt-4 text-4xl font-black leading-tight">Everything you need, delivered simply.</h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/75">Sign in to follow orders, save your details, and check out faster.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/70"><FaShieldAlt /> Secure account access</div>
        </div>

        <div className="p-6 sm:p-10">

        {/* Header */}
        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf6f0] text-xl text-[#17633a]">
            <FaLock />
          </div>

          <h1 className="mt-5 text-3xl font-black text-[#202a22]">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Login to your ShopHub account
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="shop-page-enter mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => startSocialLogin("google")} className="flex items-center justify-center gap-2 rounded-xl border border-[#dce5dc] px-3 py-3 text-sm font-semibold text-[#37433a] transition hover:border-[#a9c9b2] hover:bg-[#f7faf7]">
            <FaGoogle className="text-red-500" /> Google
          </button>
          <button type="button" onClick={() => startSocialLogin("facebook")} className="flex items-center justify-center gap-2 rounded-xl border border-[#dce5dc] px-3 py-3 text-sm font-semibold text-[#37433a] transition hover:border-[#a9c9b2] hover:bg-[#f7faf7]">
            <FaFacebookF className="text-blue-600" /> Facebook
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-[#e3e9e3]" /> OR CONTINUE WITH EMAIL <span className="h-px flex-1 bg-[#e3e9e3]" /></div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <div className="relative">

              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-[#d8e0d8] py-3 pl-11 pr-4 outline-none transition focus:border-[#17633a] focus:ring-2 focus:ring-[#edf6f0]"
              />

            </div>
          </div>

          {/* Password */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <div className="relative">

              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-[#d8e0d8] py-3 pl-11 pr-12 outline-none transition focus:border-[#17633a] focus:ring-2 focus:ring-[#edf6f0]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {/* Forgot password */}
          <div className="text-right">

            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-[#17633a] hover:text-[#12532f]"
            >
              Forgot Password?
            </Link>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#17633a] py-3 font-semibold text-white transition hover:bg-[#12532f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register */}
        <div className="mt-7 border-t border-[#e3e9e3] pt-6 text-center text-sm text-slate-500">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-semibold text-[#17633a] hover:text-[#12532f]"
          >
            Create Account
          </Link>

        </div>

        </div>
      </div>

    </div>
  );
}

export default Login;