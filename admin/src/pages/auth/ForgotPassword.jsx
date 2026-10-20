import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiMail,
  FiShoppingBag,
} from "react-icons/fi";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setMessage(
      "If an account exists with this email, you will receive password reset instructions."
    );
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

        {/* Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">

          {/* Heading */}
          <div className="mb-6">

            <h2 className="text-2xl font-bold text-slate-900">
              Forgot Password?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your admin email address and we
              will send you instructions to reset your
              password.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
              {message}
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
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="admin@shophub.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Send Reset Instructions
            </button>

          </form>

          {/* Back to Login */}
          <div className="mt-6 border-t border-slate-200 pt-6 text-center">

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
            >
              <FiArrowLeft size={16} />
              Back to Login
            </Link>

          </div>

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          ShopHub Admin Panel
        </p>

      </div>

    </div>
  );
}

export default ForgotPassword;