import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import {
  FaCheck,
  FaShoppingBag,
  FaClipboardList,
} from "react-icons/fa";
import API from "../../services/api";

function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);

  useEffect(() => {
    if (!order) {
      API.get(`/orders/${id}`)
        .then((response) => setOrder(response.data.order))
        .catch(() => setOrder(null));
    }
  }, [id, order]);

  const isPaid = order?.paymentStatus === "Paid";

  return (
    <main className="shop-page-enter flex min-h-[75vh] items-center justify-center bg-[#f4f7f3] px-4 py-12">
      <div className="w-full max-w-xl rounded-2xl border border-[#e2e9e2] bg-white p-6 text-center shadow-sm sm:p-10">

        {/* SUCCESS ICON */}

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white">
            <FaCheck />
          </div>
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-green-600">
          Order Confirmed
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Thank You For Your Order!
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500">
          Your order has been successfully placed. We will process it and
          prepare it for delivery.
        </p>

        {/* ORDER ID */}

        <div className="mt-6 rounded-xl bg-[#f4f7f3] p-4">
          <p className="text-xs text-slate-500">
            Order ID
          </p>

          <p className="mt-1 break-all font-mono text-sm font-semibold text-slate-800">
            {id}
          </p>
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${isPaid ? "border-[#cfe3d5] bg-[#edf6f0]" : "border-amber-200 bg-amber-50"}`}>
          <p className={`text-sm font-semibold ${isPaid ? "text-[#17633a]" : "text-amber-800"}`}>
            Payment {isPaid ? "Complete" : "Status"}
          </p>

          <p className={`mt-1 text-sm ${isPaid ? "text-[#17633a]" : "text-amber-700"}`}>
            {order ? `${order.paymentMethod} - ${order.paymentStatus}` : "Checking payment status..."}
          </p>
        </div>

        {/* BUTTONS */}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to={`/orders/${id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17633a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#12532f]"
          >
            <FaClipboardList />
            View Order
          </Link>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8e0d8] bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#f4f7f3]"
          >
            <FaShoppingBag />
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;