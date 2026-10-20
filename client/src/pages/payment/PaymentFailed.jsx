import { Link, useLocation } from "react-router-dom";

const PaymentFailed = () => {
  const location = useLocation();

  const params =
    new URLSearchParams(
      location.search
    );

  const orderId =
    params.get("orderId");

  return (
    <div className="shop-page-enter flex min-h-[70vh] items-center justify-center bg-[#f4f7f3] px-4 py-12">

      <div className="w-full max-w-lg rounded-2xl border border-[#e2e9e2] bg-white p-8 text-center shadow-sm">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl font-black text-red-600">
          ×
        </div>

        <h1 className="text-3xl font-black text-slate-900">
          Payment Failed
        </h1>

        <p className="mt-3 text-slate-500">
          Your payment could not be completed. Please try again.
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
            to="/checkout"
            className="flex-1 rounded-xl bg-[#17633a] px-5 py-3 font-bold text-white transition hover:bg-[#12532f]"
          >
            Try Again
          </Link>

          <Link
            to="/orders"
            className="flex-1 rounded-xl border border-[#d8e0d8] px-5 py-3 font-bold text-slate-700 transition hover:bg-[#f4f7f3]"
          >
            My Orders
          </Link>

        </div>

      </div>

    </div>
  );
};

export default PaymentFailed;