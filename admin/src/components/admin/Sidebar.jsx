import { NavLink } from "react-router-dom";

import {
  FiGrid,
  FiBox,
  FiTag,
  FiShoppingBag,
  FiMail,
  FiUsers,
  FiLogOut,
  FiX,
  FiSettings,
} from "react-icons/fi";

function Sidebar({ isOpen, setIsOpen }) {
  const admin = JSON.parse(
    localStorage.getItem("admin") || "null"
  );

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FiGrid />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <FiBox />,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <FiTag />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <FiShoppingBag />,
    },
    {
      name: "Contact Messages",
      path: "/admin/messages",
      icon: <FiMail />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FiUsers />,
    },
    {
      name: "Admin Profile",
      path: "/admin/profile",
      icon: <FiSettings />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    window.location.href = "/login";
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64
          flex-col bg-slate-900 text-white
          transition-transform duration-300
          lg:static lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-700 px-5">
          <div>
            <h1 className="text-xl font-bold">
              ShopHub
            </h1>

            <p className="text-xs text-slate-400">
              Admin Panel
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 hover:bg-slate-800 lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Admin */}
        <div className="border-b border-slate-700 p-4">
          <p className="text-xs text-slate-400">
            Logged in as
          </p>

          <p className="mt-1 truncate text-sm font-medium">
            {admin?.name || "Administrator"}
          </p>

          <p className="truncate text-xs text-slate-400">
            {admin?.email || ""}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `
                flex items-center gap-3 rounded-lg px-4 py-3
                text-sm font-medium transition
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
                `
              }
            >
              <span className="text-lg">
                {item.icon}
              </span>

              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-700 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <FiLogOut size={19} />

            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;