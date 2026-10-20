import {
  FiBox,
  FiTag,
  FiShoppingBag,
  FiUsers,
  FiArrowUpRight,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

function Dashboard() {
  const [data, setData] = useState({ products: 0, categories: 0, orders: [], users: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [products, categories, orders, users] = await Promise.all([
          API.get("/products"),
          API.get("/categories"),
          API.get("/orders/admin/all"),
          API.get("/users/admin"),
        ]);
        setData({
          products: products.data.products?.length || 0,
          categories: categories.data.categories?.length || 0,
          orders: orders.data.orders || [],
          users: users.data.users?.length || 0,
        });
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Unable to load dashboard data.");
      }
    };
    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Total Products",
      value: data.products,
      icon: <FiBox />,
      description: "Products in store",
    },
    {
      title: "Categories",
      value: data.categories,
      icon: <FiTag />,
      description: "Active categories",
    },
    {
      title: "Total Orders",
      value: data.orders.length,
      icon: <FiShoppingBag />,
      description: "Orders received",
    },
    {
      title: "Total Users",
      value: data.users,
      icon: <FiUsers />,
      description: "Registered customers",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening with your store.
        </p>
      </div>

      {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {stat.value}
                </h2>

                <p className="mt-2 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom section */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Latest customer orders
              </p>
            </div>

            <Link to="/admin/orders" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
              <FiArrowUpRight />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {data.orders.slice(0, 5).map((order) => (
              <Link key={order._id} to={`/admin/orders/${order._id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50">
                <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{order.user?.name || order.shippingAddress?.fullName || "Guest customer"}</p><p className="mt-1 text-xs text-slate-400">#{order._id}</p></div>
                <div className="text-right"><p className="text-sm font-bold text-slate-900">Rs. {Number(order.totalPrice || 0).toLocaleString()}</p><p className="mt-1 text-xs text-blue-600">{order.orderStatus}</p></div>
              </Link>
            ))}
            {data.orders.length === 0 && <div className="p-8 text-center"><FiShoppingBag className="mx-auto text-slate-300" size={40} /><p className="mt-3 text-sm text-slate-500">No orders yet</p></div>}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-semibold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Common admin actions
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-5">
            <Link to="/admin/products/add" className="rounded-lg border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50">
              <FiBox className="text-xl text-blue-600" />

              <p className="mt-2 text-sm font-semibold text-slate-700">
                Add Product
              </p>
            </Link>

            <Link to="/admin/categories/add" className="rounded-lg border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50">
              <FiTag className="text-xl text-blue-600" />

              <p className="mt-2 text-sm font-semibold text-slate-700">
                Add Category
              </p>
            </Link>

            <Link to="/admin/orders" className="rounded-lg border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50">
              <FiShoppingBag className="text-xl text-blue-600" />

              <p className="mt-2 text-sm font-semibold text-slate-700">
                View Orders
              </p>
            </Link>

            <Link to="/admin/users" className="rounded-lg border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50">
              <FiUsers className="text-xl text-blue-600" />

              <p className="mt-2 text-sm font-semibold text-slate-700">
                View Users
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;