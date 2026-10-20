
import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import OAuthCallback from "./pages/auth/OAuthCallback";
import VerifyEmail from "./pages/auth/VerifyEmail";

import Profile from "./pages/profile/Profile";

import Products from "./pages/products/Products";
import ProductDetails from "./pages/products/ProductDetails";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFailed from "./pages/payment/PaymentFailed";
import Checkout from "./pages/checkout/Checkout";
import OrderSuccess from "./pages/orders/OrderSuccess";
import MyOrders from "./pages/orders/MyOrders";
import OrderDetails from "./pages/orders/OrderDetails";
import Wishlist from "./pages/wishlist/Wishlist";
import Cart from "./pages/cart/Cart";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}

function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageTitles = {
      "/": "ShopHub",
      "/about": "About Us | ShopHub",
      "/contact": "Contact Us | ShopHub",
      "/products": "Shop Products | ShopHub",
      "/login": "Log In | ShopHub",
      "/register": "Create Account | ShopHub",
      "/oauth/callback": "Signing In | ShopHub",
      "/verify-email": "Verify Email | ShopHub",
      "/cart": "Shopping Cart | ShopHub",
      "/wishlist": "Wishlist | ShopHub",
      "/profile": "My Profile | ShopHub",
      "/orders": "My Orders | ShopHub",
      "/checkout": "Checkout | ShopHub",
      "/payment-success": "Payment Successful | ShopHub",
      "/payment-failed": "Payment Failed | ShopHub",
    };

    if (pathname.startsWith("/products/")) {
      document.title = "Product Details | ShopHub";
    } else if (pathname.startsWith("/orders/")) {
      document.title = "Order Details | ShopHub";
    } else if (pathname.startsWith("/order-success/")) {
      document.title = "Order Confirmed | ShopHub";
    } else {
      document.title = pageTitles[pathname] || "Page Not Found | ShopHub";
    }
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const initial = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 0, y: 12 };

  const animate = { opacity: 1, y: 0 };

  const exit = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 0, y: -6 };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.3,
          ease: "easeOut",
        }}
        className="min-h-[50vh]"
      >
        <Routes location={location}>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Products */}
          <Route path="/products" element={<Products />} />
          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          {/* General pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/oauth/callback"
            element={<OAuthCallback />}
          />
          <Route
            path="/verify-email"
            element={<VerifyEmail />}
          />

          {/* Cart and wishlist */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Protected pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/payment-success"
              element={<PaymentSuccess />}
            />
            <Route
              path="/payment-failed"
              element={<PaymentFailed />}
            />
            <Route
              path="/order-success/:id"
              element={<OrderSuccess />}
            />
            <Route path="/orders" element={<MyOrders />} />
            <Route
              path="/orders/:id"
              element={<OrderDetails />}
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-white">
      <BrowserRouter>
        <ScrollToTop />
        <PageTitle />

        <AuthProvider>
          <CartProvider>
            <Navbar />

            <main>
              <AnimatedRoutes />
            </main>

            <Footer />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
