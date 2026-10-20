import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBoxOpen,
  FaArrowRight,
  FaTrash,
} from "react-icons/fa";

import API from "../../services/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingOrderId, setDeletingOrderId] =
    useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response = await API.get(
          "/orders/my-orders"
        );

        if (response.data.success) {
          setOrders(response.data.orders || []);
        }
      } catch (error) {
        console.error("MY ORDERS ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (order) => {
    if (
      !window.confirm(
        `Delete order #${order._id}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeletingOrderId(order._id);
      setError("");

      await API.delete(`/orders/my-orders/${order._id}`);

      setOrders((currentOrders) =>
        currentOrders.filter(
          (currentOrder) => currentOrder._id !== order._id
        )
      );
    } catch (error) {
      console.error("DELETE MY ORDER ERROR:", error);
      setError(
        error.response?.data?.message ||
          "Unable to delete your order."
      );
    } finally {
      setDeletingOrderId("");
    }
  };

  if (loading) {
    return (
      <main className="shop-page-enter flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#17633a]" />

          <p className="mt-4 text-sm text-slate-500">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="shop-page-enter bg-[#f4f7f3] py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#17633a]">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#202a22]">
            My Orders
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View and track your ShopHub orders.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-[#e2e9e2] bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#edf6f0] text-2xl text-[#17633a]">
              <FaBoxOpen />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#202a22]">
              No Orders Yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              You haven't placed an order yet.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex rounded-xl bg-[#17633a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#12532f]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="shop-stagger-enter space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-[#e2e9e2] bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-slate-400">
                      Order ID
                    </p>

                    <p className="mt-1 break-all font-mono text-sm font-semibold text-slate-800">
                      {order._id}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <StatusBadge
                    status={order.orderStatus}
                  />
                </div>

                <div className="my-5 border-t border-slate-200" />

                <div className="mb-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                  <span>Payment: {order.paymentMethod}</span>
                  <span>Payment status: {order.paymentStatus}</span>
                  {order.paymentDetails?.transactionId && (
                    <span>
                      Reference: {order.paymentDetails.transactionId}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {order.orderItems
                    .slice(0, 3)
                    .map((item) => (
                      <div
                        key={`${order._id}-${item.product}`}
                        className="flex items-center gap-3"
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-medium text-slate-800">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <p className="text-sm font-semibold text-slate-800">
                          Rs.{" "}
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    ))}
                </div>

                {order.orderItems.length > 3 && (
                  <p className="mt-3 text-xs text-slate-400">
                    +{" "}
                    {order.orderItems.length - 3} more
                    product(s)
                  </p>
                )}

                <div className="my-5 border-t border-slate-200" />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-slate-500">
                      Total Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-[#17633a]">
                      Rs.{" "}
                      {Number(
                        order.totalPrice
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17633a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12532f]"
                    >
                      View Details
                      <FaArrowRight />
                    </Link>

                    <button
                      type="button"
                      title="Delete order"
                      aria-label={`Delete order ${order._id}`}
                      onClick={() => handleDeleteOrder(order)}
                      disabled={deletingOrderId === order._id}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingOrderId === order._id ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
                      ) : (
                        <FaTrash />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
        statusClasses[status] ||
        "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

export default MyOrders;