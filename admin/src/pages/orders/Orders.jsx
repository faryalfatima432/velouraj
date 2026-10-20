import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaEye,
  FaSearch,
  FaBoxOpen,
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaSyncAlt,
  FaTrash,
} from "react-icons/fa";

import API from "../../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [deletingOrderId, setDeletingOrderId] =
    useState("");

  /*
  ==================================================
  FETCH ORDERS
  ==================================================
  */

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/orders/admin/all"
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error("ADMIN ORDERS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (order) => {
    const confirmed = window.confirm(
      `Delete order #${order._id}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingOrderId(order._id);
      setError("");

      await API.delete(`/orders/admin/${order._id}`);

      setOrders((currentOrders) =>
        currentOrders.filter(
          (currentOrder) => currentOrder._id !== order._id
        )
      );
    } catch (error) {
      console.error("DELETE ORDER ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete order."
      );
    } finally {
      setDeletingOrderId("");
    }
  };

  /*
  ==================================================
  FILTER ORDERS
  ==================================================
  */

  const filteredOrders = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "All" ||
        order.orderStatus === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!searchValue) {
        return true;
      }

      const orderId =
        order._id?.toLowerCase() || "";

      const customerName =
        order.user?.name?.toLowerCase() || "";

      const customerEmail =
        order.user?.email?.toLowerCase() || "";

      const customerPhone =
        order.user?.phone?.toLowerCase() || "";

      return (
        orderId.includes(searchValue) ||
        customerName.includes(searchValue) ||
        customerEmail.includes(searchValue) ||
        customerPhone.includes(searchValue)
      );
    });
  }, [orders, search, statusFilter]);

  /*
  ==================================================
  ORDER STATISTICS
  ==================================================
  */

  const statistics = {
    total: orders.length,

    pending: orders.filter(
      (order) => order.orderStatus === "Pending"
    ).length,

    processing: orders.filter(
      (order) =>
        order.orderStatus === "Processing"
    ).length,

    shipped: orders.filter(
      (order) => order.orderStatus === "Shipped"
    ).length,

    delivered: orders.filter(
      (order) =>
        order.orderStatus === "Delivered"
    ).length,

    cancelled: orders.filter(
      (order) =>
        order.orderStatus === "Cancelled"
    ).length,
  };

  return (
    <div className="space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Order Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage customer orders, payments and delivery
            status.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-60"
        >
          <FaSyncAlt
            className={
              loading ? "animate-spin" : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* ==================================================
          STATISTICS
      ================================================== */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">

        <StatCard
          title="Total"
          value={statistics.total}
          icon={<FaBoxOpen />}
        />

        <StatCard
          title="Pending"
          value={statistics.pending}
          icon={<FaClock />}
        />

        <StatCard
          title="Processing"
          value={statistics.processing}
          icon={<FaSyncAlt />}
        />

        <StatCard
          title="Shipped"
          value={statistics.shipped}
          icon={<FaTruck />}
        />

        <StatCard
          title="Delivered"
          value={statistics.delivered}
          icon={<FaCheckCircle />}
        />

        <StatCard
          title="Cancelled"
          value={statistics.cancelled}
          icon={<FaTimesCircle />}
        />
      </div>

      {/* ==================================================
          FILTERS
      ================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">

          {/* SEARCH */}

          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search order ID, customer name, email..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500"
          >
            <option value="All">
              All Statuses
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Processing">
              Processing
            </option>

            <option value="Shipped">
              Shipped
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>
        </div>
      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading ? (
        <LoadingState />
      ) : filteredOrders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* DESKTOP TABLE */}

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Order
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Items
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Total
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <OrderTableRow
                    key={order._id}
                    order={order}
                    onDelete={handleDeleteOrder}
                    deleting={deletingOrderId === order._id}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}

          <div className="divide-y divide-slate-200 lg:hidden">
            {filteredOrders.map((order) => (
              <OrderMobileCard
                key={order._id}
                order={order}
                onDelete={handleDeleteOrder}
                deleting={deletingOrderId === order._id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/*
==================================================
STAT CARD
==================================================
*/

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
          {icon}
        </div>
      </div>
    </div>
  );
}

/*
==================================================
DESKTOP ORDER ROW
==================================================
*/

function OrderTableRow({ order, onDelete, deleting }) {
  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50">

      <td className="px-5 py-4">
        <p className="max-w-32.5 truncate font-mono text-xs font-semibold text-slate-800">
          #{order._id}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-slate-800">
          {order.user?.name || order.shippingAddress?.fullName || "Unknown"}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {order.user?.email || "-"}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm text-slate-600">
          {new Date(
            order.createdAt
          ).toLocaleDateString()}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm text-slate-600">
          {order.orderItems?.length || 0}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-bold text-slate-900">
          Rs.{" "}
          {Number(
            order.totalPrice || 0
          ).toLocaleString()}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-xs font-medium text-slate-600">
          {order.paymentMethod}
        </p>

        <p className="mt-1 text-[11px] text-yellow-600">
          {order.paymentStatus}
        </p>
      </td>

      <td className="px-5 py-4">
        <StatusBadge
          status={order.orderStatus}
        />
      </td>

      <td className="px-5 py-4 text-right">
        <div className="inline-flex items-center gap-2">
          <Link
            to={`/admin/orders/${order._id}`}
            title="View and update order"
            aria-label="View and update order"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-orange-500 hover:text-white"
          >
            <FaEye />
            View
          </Link>

          <button
            type="button"
            title="Delete order"
            aria-label={`Delete order ${order._id}`}
            onClick={() => onDelete(order)}
            disabled={deleting}
            className="inline-flex items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
            ) : (
              <FaTrash />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

/*
==================================================
MOBILE ORDER CARD
==================================================
*/

function OrderMobileCard({ order, onDelete, deleting }) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold text-slate-800">
            #{order._id}
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {order.user?.name || order.shippingAddress?.fullName || "Unknown"}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {order.user?.email || "-"}
          </p>
        </div>

        <StatusBadge
          status={order.orderStatus}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-3">
        <div>
          <p className="text-[11px] text-slate-400">
            Date
          </p>

          <p className="mt-1 text-xs font-medium text-slate-700">
            {new Date(
              order.createdAt
            ).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-slate-400">
            Items
          </p>

          <p className="mt-1 text-xs font-medium text-slate-700">
            {order.orderItems?.length || 0}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-slate-400">
            Payment
          </p>

          <p className="mt-1 text-xs font-medium text-slate-700">
            {order.paymentMethod}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-slate-400">
            Total
          </p>

          <p className="mt-1 text-sm font-bold text-orange-500">
            Rs.{" "}
            {Number(
              order.totalPrice || 0
            ).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        <Link
          to={`/admin/orders/${order._id}`}
          title="View and update order"
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-orange-500"
        >
          <FaEye />
          View Order
        </Link>

        <button
          type="button"
          title="Delete order"
          aria-label={`Delete order ${order._id}`}
          onClick={() => onDelete(order)}
          disabled={deleting}
          className="inline-flex items-center justify-center rounded-lg bg-red-50 px-4 py-2.5 text-red-600 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
          ) : (
            <FaTrash />
          )}
        </button>
      </div>
    </div>
  );
}

/*
==================================================
STATUS BADGE
==================================================
*/

function StatusBadge({ status }) {
  const classes = {
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
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold ${
        classes[status] ||
        "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

/*
==================================================
LOADING
==================================================
*/

function LoadingState() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />

      <p className="mt-4 text-sm text-slate-500">
        Loading orders...
      </p>
    </div>
  );
}

/*
==================================================
EMPTY
==================================================
*/

function EmptyState() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
        <FaBoxOpen />
      </div>

      <h2 className="mt-4 font-bold text-slate-900">
        No Orders Found
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        No orders match your current filters.
      </p>
    </div>
  );
}

export default Orders;