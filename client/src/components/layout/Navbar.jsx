
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import {
  FaBars,
  FaTimes,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaHeart,
  FaHome,
  FaBoxOpen,
  FaInfoCircle,
  FaPhoneAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaThLarge,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const searchValue = search.trim();

    if (!searchValue) {
      navigate("/products");
    } else {
      navigate(`/products?search=${encodeURIComponent(searchValue)}`);
    }

    setSearch("");
    setMobileMenuOpen(false);
    setAccountOpen(false);
  };

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "";

  const cartBadge = (
    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-extrabold leading-none text-[#17633a] shadow-sm ring-2 ring-[#17633a]">
      {cartCount > 99 ? "99+" : cartCount}
    </span>
  );

  const transitionDuration = shouldReduceMotion ? 0 : 0.22;

  return (
    <>
      {/* NAVBAR */}
      <motion.header
        initial={shouldReduceMotion ? false : { opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.4,
          ease: "easeOut",
        }}
        className="sticky top-0 z-50 w-full"
      >
        <nav className="border-b border-white/10 bg-[#17633a] text-white shadow-md">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            {/* MAIN ROW */}
            <div className="relative flex h-17 items-center gap-2 lg:h-19 lg:gap-6">
              {/* LOGO */}
              <Link
                to="/"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAccountOpen(false);
                }}
                className="order-1 flex shrink-0 flex-col"
              >
                <span className="text-[23px] font-extrabold leading-none tracking-tight sm:text-[26px]">
                  Shop
                  <span className="text-[#d8f0df]">Hub</span>
                </span>

                <span className="mt-1 hidden text-[8px] font-medium uppercase tracking-[2.5px] text-white/70 sm:block">
                  Shop • Discover • Enjoy
                </span>
              </Link>

              {/* DESKTOP SEARCH */}
              <form
                onSubmit={handleSearch}
                className="absolute left-1/2 hidden w-[min(40vw,480px)] -translate-x-1/2 xl:block 2xl:w-[min(42vw,600px)]"
              >
                <div className="flex h-11 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition focus-within:ring-2 focus-within:ring-[#8fc5a3]">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products, brands..."
                    className="min-w-0 flex-1 bg-white px-4 text-sm text-[#252a25] outline-none placeholder:text-[#999d96]"
                    aria-label="Search products"
                  />

                  <button
                    type="submit"
                    aria-label="Search products"
                    className="flex w-12 shrink-0 items-center justify-center bg-[#2c8052] text-white transition hover:bg-[#236e45] active:bg-[#1b5d3a]"
                  >
                    <FaSearch className="text-sm" />
                  </button>
                </div>
              </form>

              {/* RIGHT SIDE ICONS */}
              <div className="order-2 ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
                {/* HOME */}
                <Link
                  to="/"
                  aria-label="Home"
                  title="Home"
                  className={`order-1 flex h-10 w-10 items-center justify-center rounded-xl transition ${
                    isActive("/")
                      ? "bg-white/15 text-white"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <FaHome className="text-[16px]" />
                </Link>

                {/* ACCOUNT */}
                <div className="relative order-2">
                  <button
                    type="button"
                    onClick={() => setAccountOpen((open) => !open)}
                    aria-label={user ? `Account for ${user.name}` : "Account"}
                    title="Account"
                    aria-expanded={accountOpen}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                      accountOpen ? "bg-white/15" : "hover:bg-white/10"
                    }`}
                  >
                    {user ? (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#17633a]">
                        {userInitial}
                      </span>
                    ) : (
                      <FaUser className="text-[17px]" />
                    )}
                  </button>

                  <AnimatePresence>
                    {accountOpen && (
                      <>
                        <button
                          type="button"
                          aria-label="Close account menu"
                          onClick={() => setAccountOpen(false)}
                          className="fixed inset-0 z-40 cursor-default"
                        />

                        <motion.div
                          initial={
                            shouldReduceMotion
                              ? false
                              : { opacity: 0, y: -8, scale: 0.98 }
                          }
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={
                            shouldReduceMotion
                              ? { opacity: 1 }
                              : { opacity: 0, y: -5, scale: 0.98 }
                          }
                          transition={{ duration: transitionDuration }}
                          className="absolute right-0 top-full z-50 mt-3 w-67.5 overflow-hidden rounded-xl border border-[#e7e7e1] bg-white text-[#252a25] shadow-xl"
                        >
                          {user ? (
                            <>
                              <div className="border-b border-[#eeeeea] bg-[#fafaf7] px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#17633a] font-bold text-white">
                                    {userInitial}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-bold">
                                      {user.name}
                                    </p>
                                    <p className="truncate text-xs text-[#777b73]">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <Link
                                to="/profile"
                                onClick={() => setAccountOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-[#f5f6f1]"
                              >
                                <FaUserCircle className="text-[#17633a]" />
                                My Profile
                              </Link>

                              <Link
                                to="/orders"
                                onClick={() => setAccountOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-[#f5f6f1]"
                              >
                                <FaBoxOpen className="text-[#17633a]" />
                                My Orders
                              </Link>

                              <Link
                                to="/wishlist"
                                onClick={() => setAccountOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-[#f5f6f1]"
                              >
                                <FaHeart className="text-[#17633a]" />
                                Wishlist
                              </Link>

                              <div className="border-t border-[#eeeeea]" />

                              <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                              >
                                <FaSignOutAlt />
                                Logout
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="border-b border-[#eeeeea] bg-[#fafaf7] px-4 py-4">
                                <p className="text-sm font-bold">
                                  Welcome to ShopHub
                                </p>
                                <p className="mt-1 text-xs text-[#777b73]">
                                  Sign in to manage your account and orders.
                                </p>
                              </div>

                              <Link
                                to="/login"
                                onClick={() => setAccountOpen(false)}
                                className="mx-3 mt-3 flex justify-center rounded-lg bg-[#17633a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12532f]"
                              >
                                Login
                              </Link>

                              <Link
                                to="/register"
                                onClick={() => setAccountOpen(false)}
                                className="mx-3 mb-3 mt-2 flex justify-center rounded-lg border border-[#17633a] px-4 py-2.5 text-sm font-semibold text-[#17633a] transition hover:bg-[#f1f7f3]"
                              >
                                Create Account
                              </Link>
                            </>
                          )}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* CART */}
                <Link
                  to="/cart"
                  aria-label={`Shopping cart, ${cartCount} items`}
                  title="Shopping cart"
                  className={`relative order-3 flex h-10 w-10 items-center justify-center rounded-xl transition ${
                    isActive("/cart") ? "bg-white/15" : "hover:bg-white/10"
                  }`}
                >
                  <FaShoppingCart className="text-[17px]" />
                  {cartCount > 0 && cartBadge}
                </Link>

                {/* MOBILE MENU BUTTON */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open navigation menu"
                  aria-expanded={mobileMenuOpen}
                  className="order-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
                >
                  <FaBars className="text-lg" />
                </button>
              </div>
            </div>

            {/* TABLET AND MOBILE SEARCH */}
            <div className="pb-3 xl:hidden">
              <form onSubmit={handleSearch}>
                <div className="flex h-11 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products, brands, categories..."
                    className="min-w-0 flex-1 bg-white px-4 text-sm text-[#252a25] outline-none placeholder:text-[#999d96]"
                    aria-label="Search products"
                  />

                  <button
                    type="submit"
                    className="flex w-12 shrink-0 items-center justify-center rounded-r-2xl bg-[#2c8052] text-white transition hover:bg-[#236e45]"
                    aria-label="Search"
                  >
                    <FaSearch />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: transitionDuration }}
            className="fixed inset-0 z-60"
          >
            {/* OVERLAY */}
            <button
              type="button"
              aria-label="Close navigation"
              onClick={closeMobileMenu}
              className="absolute inset-0 cursor-default bg-black/40"
            />

            {/* DRAWER */}
            <motion.aside
              initial={
                shouldReduceMotion ? false : { x: "100%" }
              }
              animate={{ x: 0 }}
              exit={
                shouldReduceMotion ? { x: 0 } : { x: "100%" }
              }
              transition={{
                duration: shouldReduceMotion ? 0 : 0.28,
                ease: "easeOut",
              }}
              className="absolute bottom-0 right-0 top-0 z-70 w-85 max-w-[88vw] overflow-y-auto bg-white shadow-2xl sm:w-95"
            >
              {/* DRAWER HEADER */}
              <div className="bg-[#17633a] px-5 py-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-extrabold">
                      Shop<span className="text-[#d8f0df]">Hub</span>
                    </div>

                    <p className="mt-1 text-[10px] uppercase tracking-[2px] text-white/70">
                      Shop • Discover • Enjoy
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeMobileMenu}
                    aria-label="Close menu"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* USER AREA */}
              {user ? (
                <div className="border-b border-[#eeeeea] bg-[#fafaf7] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#17633a] font-bold text-white">
                      {userInitial}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[#777b73]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-b border-[#eeeeea] bg-[#fafaf7] px-5 py-4">
                  <p className="text-sm font-bold">Welcome to ShopHub</p>
                  <p className="mt-1 text-xs text-[#777b73]">
                    Login to manage your account.
                  </p>
                </div>
              )}

              {/* MOBILE MENU LINKS */}
              <div className="p-4">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium transition ${
                    isActive("/")
                      ? "bg-[#edf6f0] font-semibold text-[#17633a]"
                      : "text-[#333] hover:bg-[#f5f6f1]"
                  }`}
                >
                  <FaHome className="w-4" />
                  Home
                </Link>

                <Link
                  to="/products"
                  onClick={closeMobileMenu}
                  className={`mt-1 flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium transition ${
                    isActive("/products")
                      ? "bg-[#edf6f0] font-semibold text-[#17633a]"
                      : "text-[#333] hover:bg-[#f5f6f1]"
                  }`}
                >
                  <FaBoxOpen className="w-4" />
                  Products
                </Link>

                <Link
                  to="/products"
                  onClick={closeMobileMenu}
                  className="mt-1 flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium text-[#333] transition hover:bg-[#f5f6f1]"
                >
                  <FaThLarge className="w-4 text-[#17633a]" />
                  Categories
                </Link>

                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className={`mt-1 flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium transition ${
                    isActive("/about")
                      ? "bg-[#edf6f0] font-semibold text-[#17633a]"
                      : "text-[#333] hover:bg-[#f5f6f1]"
                  }`}
                >
                  <FaInfoCircle className="w-4" />
                  About Us
                </Link>

                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  className={`mt-1 flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium transition ${
                    isActive("/contact")
                      ? "bg-[#edf6f0] font-semibold text-[#17633a]"
                      : "text-[#333] hover:bg-[#f5f6f1]"
                  }`}
                >
                  <FaPhoneAlt className="w-4" />
                  Contact Us
                </Link>

                <div className="my-3 border-t border-[#eeeeea]" />

                {/* MOBILE CART */}
                <Link
                  to="/cart"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between rounded-lg px-4 py-3.5 text-sm font-medium text-[#333] transition hover:bg-[#f5f6f1]"
                >
                  <span className="flex items-center gap-3">
                    <FaShoppingCart className="text-[#17633a]" />
                    Cart
                  </span>

                  {cartCount > 0 && (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-xs font-extrabold text-[#17633a] ring-1 ring-[#17633a]/20">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/wishlist"
                  onClick={closeMobileMenu}
                  className="mt-1 flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium text-[#333] transition hover:bg-[#f5f6f1]"
                >
                  <FaHeart className="text-[#17633a]" />
                  Wishlist
                </Link>

                {user && (
                  <>
                    <Link
                      to="/profile"
                      onClick={closeMobileMenu}
                      className="mt-1 flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium text-[#333] transition hover:bg-[#f5f6f1]"
                    >
                      <FaUserCircle className="text-[#17633a]" />
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={closeMobileMenu}
                      className="mt-1 flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium text-[#333] transition hover:bg-[#f5f6f1]"
                    >
                      <FaBoxOpen className="text-[#17633a]" />
                      My Orders
                    </Link>
                  </>
                )}

                {!user && (
                  <div className="mt-4 space-y-2">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center rounded-lg bg-[#17633a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#12532f]"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center rounded-lg border border-[#17633a] px-4 py-3 text-sm font-semibold text-[#17633a] transition hover:bg-[#f1f7f3]"
                    >
                      Create Account
                    </Link>
                  </div>
                )}

                {user && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
