import {
  FiMenu,
  FiBell,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";

function Navbar({ setIsOpen }) {
  const admin = JSON.parse(
    localStorage.getItem("admin") || "null"
  );

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <FiMenu size={22} />
        </button>

        <div>
          <p className="text-sm font-semibold text-slate-800">
            Admin Dashboard
          </p>

          <p className="hidden text-xs text-slate-400 sm:block">
            Manage your ShopHub store
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <FiBell size={20} />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <Link to="/admin/profile" className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-50">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FiUser />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-700">
              {admin?.name || "Admin"}
            </p>

            <p className="text-xs text-slate-400">
              Administrator
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;