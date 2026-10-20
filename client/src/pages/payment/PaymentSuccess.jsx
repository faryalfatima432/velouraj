import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  FaCheckCircle,
  FaShoppingBag,
} from "react-icons/fa";

import { useCart } from "../../context/CartContext";

const PaymentSuccess = () => {
  const location = useLocation();

  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const params =
    new URLSearchParams(
      location.search
    );

  const orderId =
    params.get("orderId");

  return (
    <div className="shop-page-enter flex min-h-[70vh] items-center justify-center bg-[#f4f7f3] px-4 py-12">

      <div className="w-full max-w-lg rounded-2xl border border-[#e2e9e2] bg-white p-8 text-center shadow-sm">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#edf6f0] text-[#17633a]">
          <FaCheckCircle className="text-4xl" />
        </div>

        <h1 className="text-3xl font-black text-slate-900">
          Payment Successful
        </h1>

        <p className="mt-3 text-slate-500">
          Your payment has been received and your order is now being processed.
        </p>

        {orderId && (
          <div className="mt-6 rounded-xl bg-[#f4f7f3] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Order ID
            </p>

            <p className="mt-1 break-all font-bold text-slate-800">
              {orderId}
            </p>
          </div>
        )}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">

          <Link
            to="/orders"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#17633a] px-5 py-3 font-bold text-white transition hover:bg-[#12532f]"
          >
            <FaShoppingBag />

            My Orders
          </Link>

          <Link
            to="/products"
            className="flex-1 rounded-xl border border-[#d8e0d8] px-5 py-3 font-bold text-slate-700 transition hover:bg-[#f4f7f3]"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
};

export default PaymentSuccess;