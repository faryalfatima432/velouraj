import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaMoneyBillWave,
  FaBoxOpen,
  FaSave,
} from "react-icons/fa";

import API from "../../services/api";

function OrderDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  const [status, setStatus] = useState("");

  const [paymentStatus, setPaymentStatus] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /*
  ==================================================
  FETCH ORDER
  ==================================================
  */

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        `/orders/admin/${id}`
      );

      if (response.data.success) {
        setOrder(response.data.order);

        setStatus(
          response.data.order.orderStatus
        );

        setPaymentStatus(
          response.data.order.paymentStatus
        );
      }
    } catch (error) {
      console.error(
        "ADMIN ORDER DETAILS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load order."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await API.put(
        `/orders/admin/${id}/payment-status`,
        { paymentStatus }
      );

      if (response.data.success) {
        setOrder(response.data.order);
        setPaymentStatus(response.data.order.paymentStatus);
        setSuccess("Payment status updated successfully.");
      }
    } catch (error) {
      console.error("UPDATE PAYMENT STATUS ERROR:", error);
      setError(
        error.response?.data?.message ||
          "Unable to update payment status."
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  /*
  ==================================================
  UPDATE STATUS
  ==================================================
  */

  const handleUpdateStatus = async () => {
    if (!status) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await API.put(
        `/orders/admin/${id}/status`,
        {
          orderStatus: status,
        }
      );

      if (response.data.success) {
        setOrder(response.data.order);

        setStatus(
          response.data.order.orderStatus
        );

        setSuccess(
          "Order status updated successfully."
        );
      }
    } catch (error) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update order status."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />

          <p className="mt-4 text-sm text-slate-500">
            Loading order...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-slate-900">
          Order not found
        </h1>

        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>

        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-orange-500"
        >
          <FaArrowLeft />
          Back to Orders
        </Link>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Order Details
            </p>

            <h1 className="mt-1 break-all text-2xl font-bold text-slate-900">
              #{order._id}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Placed on{" "}
              {new Date(
                order.createdAt
              ).toLocaleString()}
            </p>
          </div>

          <StatusBadge
            status={order.orderStatus}
          />
        </div>
      </div>

      {/* ==================================================
          MESSAGES
      ================================================== */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">

        {/* ==================================================
            LEFT SIDE
        ================================================== */}

        <div className="space-y-6">

          {/* CUSTOMER */}

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
                <FaUser />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Customer Information
                </h2>

                <p className="text-xs text-slate-500">
                  Customer who placed this order
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">

              <InfoItem
                icon={<FaUser />}
                label="Name"
                value={
                  order.user?.name ||
                  order.shippingAddress?.fullName ||
                  "Unknown"
                }
              />

              <InfoItem
                icon={<FaEnvelope />}
                label="Email"
                value={
                  order.user?.email || "-"
                }
              />

              <InfoItem
                icon={<FaPhone />}
                label="Phone"
                value={
                  order.user?.phone || "-"
                }
              />
            </div>
          </section>

          {/* ORDER ITEMS */}

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-500">
                <FaBoxOpen />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Order Items
                </h2>

                <p className="text-xs text-slate-500">
                  {order.orderItems.length} product(s)
                </p>
              </div>
            </div>

            <div className="mt-5 divide-y divide-slate-200">
              {order.orderItems.map(
                (item, index) => (
                  <div
                    key={`${item.product}-${index}`}
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
                      <h3 className="font-semibold text-slate-800">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Product ID: {item.product}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Rs.{" "}
                        {Number(
                          item.price
                        ).toLocaleString()}{" "}
                        × {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-slate-900">
                        Rs.{" "}
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* SHIPPING */}

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <FaMapMarkerAlt />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Shipping Address
                </h2>

                <p className="text-xs text-slate-500">
                  Delivery information
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">
                {order.shippingAddress.fullName}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                {order.shippingAddress.phone}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {order.shippingAddress.address}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {order.shippingAddress.city}
                {order.shippingAddress.state
                  ? `, ${order.shippingAddress.state}`
                  : ""}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {order.shippingAddress.postalCode}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {order.shippingAddress.country}
              </p>
            </div>
          </section>
        </div>

        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <div className="space-y-6">

          {/* STATUS MANAGEMENT */}

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold text-slate-900">
              Update Order Status
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Change the current delivery status.
            </p>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              disabled={
                order.orderStatus === "Delivered"
              }
              className="mt-5 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 disabled:bg-slate-100 disabled:text-slate-500"
            >
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

            <button
              type="button"
              onClick={handleUpdateStatus}
              disabled={
                saving ||
                status === order.orderStatus ||
                order.orderStatus === "Delivered"
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              <FaSave />

              {saving
                ? "Saving..."
                : "Update Status"}
            </button>

            {order.orderStatus ===
              "Delivered" && (
              <p className="mt-3 text-xs text-green-600">
                This order has been delivered and can
                no longer be moved to another status.
              </p>
            )}
          </section>

          {/* PAYMENT */}

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <FaMoneyBillWave />
              </div>

              <h2 className="font-bold text-slate-900">
                Payment Information
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              <InfoRow
                label="Method"
                value={order.paymentMethod}
              />

              <InfoRow
                label="Payment Status"
                value={order.paymentStatus}
              />

              {order.paymentDetails?.transactionId && (
                <InfoRow
                  label="Transaction ID"
                  value={order.paymentDetails.transactionId}
                />
              )}

              {order.paymentDetails?.senderPhone && (
                <InfoRow
                  label="Sender Phone"
                  value={order.paymentDetails.senderPhone}
                />
              )}

              <select
                value={paymentStatus}
                onChange={(event) =>
                  setPaymentStatus(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>

              <button
                type="button"
                onClick={handleUpdatePaymentStatus}
                disabled={saving || paymentStatus === order.paymentStatus}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                <FaSave />
                Update Payment Status
              </button>
            </div>
          </section>

          {/* ORDER SUMMARY */}

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold text-slate-900">
              Order Summary
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <InfoRow
                label="Items"
                value={`Rs. ${Number(
                  order.itemsPrice
                ).toLocaleString()}`}
              />

              <InfoRow
                label="Shipping"
                value={
                  order.shippingPrice === 0
                    ? "FREE"
                    : `Rs. ${Number(
                        order.shippingPrice
                      ).toLocaleString()}`
                }
              />

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-orange-500">
                    Rs.{" "}
                    {Number(
                      order.totalPrice
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/*
==================================================
INFO ITEM
==================================================
*/

function InfoItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        {icon}
        {label}
      </div>

      <p className="mt-2 wrap-break-word text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

/*
==================================================
INFO ROW
==================================================
*/

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-500">
        {label}
      </span>

      <span className="text-right font-medium text-slate-800">
        {value}
      </span>
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
      className={`inline-flex w-fit rounded-full px-4 py-2 text-xs font-bold ${
        classes[status] ||
        "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

export default OrderDetails;