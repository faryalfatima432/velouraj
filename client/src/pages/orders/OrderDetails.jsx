import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

import API from "../../services/api";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const response = await API.get(
          `/orders/${id}`
        );

        if (response.data.success) {
          setOrder(response.data.order);
        }
      } catch (error) {
        console.error("ORDER DETAILS ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <main className="shop-page-enter flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#17633a]" />
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="shop-page-enter flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Order Not Found
          </h1>

          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>

          <Link
            to="/orders"
            className="mt-6 inline-flex rounded-xl bg-[#17633a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#12532f]"
          >
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="shop-page-enter bg-[#f4f7f3] py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#17633a]"
        >
          <FaArrowLeft />
          Back to My Orders
        </Link>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#17633a]">
              Order Details
            </p>

            <h1 className="mt-2 break-all text-2xl font-bold text-slate-900">
              #{order._id}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Placed on{" "}
              {new Date(
                order.createdAt
              ).toLocaleDateString()}
            </p>
          </div>

          <StatusBadge status={order.orderStatus} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_350px]">

          {/* ITEMS */}

          <section className="rounded-2xl border border-[#e2e9e2] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Order Items
            </h2>

            <div className="mt-5 divide-y divide-slate-200">
              {order.orderItems.map((item) => (
                <div
                  key={`${item.product}-${item.quantity}`}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Rs. {item.price.toLocaleString()} ×{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-slate-900">
                    Rs.{" "}
                    {(
                      item.price * item.quantity
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT */}

          <div className="space-y-6">

            {/* SHIPPING */}

            <section className="rounded-2xl border border-[#e2e9e2] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf6f0] text-[#17633a]">
                  <FaMapMarkerAlt />
                </div>

                <h2 className="font-bold text-slate-900">
                  Shipping Address
                </h2>
              </div>

              <div className="mt-4 space-y-1 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">
                  {order.shippingAddress.fullName}
                </p>

                <p>
                  {order.shippingAddress.phone}
                </p>

                <p>
                  {order.shippingAddress.address}
                </p>

                <p>
                  {order.shippingAddress.city}
                  {order.shippingAddress.state
                    ? `, ${order.shippingAddress.state}`
                    : ""}
                </p>

                <p>
                  {order.shippingAddress.postalCode}
                </p>

                <p>
                  {order.shippingAddress.country}
                </p>
              </div>
            </section>

            {/* PAYMENT */}

            <section className="rounded-2xl border border-[#e2e9e2] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <FaMoneyBillWave />
                </div>

                <h2 className="font-bold text-slate-900">
                  Payment
                </h2>
              </div>

              <p className="mt-4 text-sm text-slate-600">
                {order.paymentMethod}
              </p>

              <p className="mt-1 text-xs font-semibold text-yellow-600">
                Payment: {order.paymentStatus}
              </p>

              {order.paymentDetails?.transactionId && (
                <p className="mt-2 text-xs text-slate-500">
                  Transaction ID: {order.paymentDetails.transactionId}
                </p>
              )}
            </section>

            {/* SUMMARY */}

            <section className="rounded-2xl border border-[#e2e9e2] bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-900">
                Order Summary
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span>
                    Rs.{" "}
                    {order.itemsPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Shipping
                  </span>

                  <span>
                    {order.shippingPrice === 0
                      ? "FREE"
                      : `Rs. ${order.shippingPrice.toLocaleString()}`}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold">
                      Total
                    </span>

                    <span className="text-xl font-bold text-[#17633a]">
                      Rs.{" "}
                      {order.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusBadge({ status }) {
  const statusClasses = {
    Pending:
      "bg-yellow-100 text-yellow-700",
    Processing:
      "bg-blue-100 text-blue-700",
    Shipped:
      "bg-purple-100 text-purple-700",
    Delivered:
      "bg-green-100 text-green-700",
    Cancelled:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-4 py-2 text-xs font-bold ${
        statusClasses[status] ||
        "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

export default OrderDetails;