
import { motion, useReducedMotion } from "framer-motion";
import LegalModals from "../LegalModals";
import FaqModal from "../FaqModal";
import { Link } from "react-router-dom";

import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowRight,
  FaWhatsapp,
  FaCreditCard,
  FaTruck,
  FaShieldAlt,
  FaUndo,
} from "react-icons/fa";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Shop All Products", path: "/products" },
  { name: "Categories", path: "/products" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contact" },
];

const customerLinks = [
  { name: "My Account", path: "/profile" },
  { name: "My Orders", path: "/orders" },
  { name: "My Wishlist", path: "/wishlist" },
  { name: "Shopping Cart", path: "/cart" },
];

const serviceFeatures = [
  {
    icon: FaTruck,
    title: "Convenient Delivery",
    description: "Delivery to your doorstep",
  },
  {
    icon: FaShieldAlt,
    title: "Secure Shopping",
    description: "A safer shopping experience",
  },
  {
    icon: FaUndo,
    title: "Customer Support",
    description: "We're here to help",
  },
  {
    icon: FaCreditCard,
    title: "Flexible Payments",
    description: "Available payment options",
  },
];

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const revealTransition = {
    duration: shouldReduceMotion ? 0 : 0.45,
    ease: "easeOut",
  };

  return (
    <footer className="bg-[#103d29] text-white">
      {/* SERVICE FEATURES */}
      <div className="border-b border-white/10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.1,
              },
            },
          }}
          className="mx-auto grid max-w-350 grid-cols-2 gap-x-3 gap-y-7 px-4 py-8 sm:gap-x-5 sm:px-6 sm:py-9 md:grid-cols-4 lg:px-12"
        >
          {serviceFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                transition={revealTransition}
                className="flex items-start gap-2.5 sm:gap-4"
              >
                <motion.div
                  whileHover={
                    shouldReduceMotion ? undefined : { scale: 1.08, y: -2 }
                  }
                  transition={{ duration: 0.2 }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-base text-green-200 sm:h-12 sm:w-12 sm:text-xl"
                >
                  <Icon />
                </motion.div>

                <div className="min-w-0">
                  <h3 className="text-xs font-semibold leading-5 sm:text-base">
                    {feature.title}
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-green-100/70 sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* MAIN FOOTER */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: shouldReduceMotion ? 0 : 0.12,
            },
          },
        }}
        className="mx-auto max-w-350 px-4 py-10 sm:px-6 sm:py-14 lg:px-12"
      >
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-[1.25fr_0.8fr_0.9fr_1.1fr] lg:gap-8 xl:gap-10">
          {/* BRAND */}
          <motion.div
            variants={fadeUp}
            transition={revealTransition}
            className="min-w-0"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2"
              aria-label="ShopHub home"
            >
              <motion.span
                whileHover={
                  shouldReduceMotion ? undefined : { rotate: -5, scale: 1.05 }
                }
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-extrabold text-[#17633a]"
              >
                S
              </motion.span>

              <span className="text-2xl font-extrabold tracking-tight">
                Shop<span className="text-green-300">Hub</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-green-100/75">
              Your everyday shopping destination. Discover useful products,
              explore new favorites, and enjoy a convenient way to shop online.
            </p>

            {/* SOCIAL LINKS */}
            <div className="mt-6 flex items-center gap-3">
              <motion.a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                whileHover={
                  shouldReduceMotion ? undefined : { y: -4, scale: 1.05 }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-sm text-white shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <FaFacebookF />
              </motion.a>

              <motion.a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                whileHover={
                  shouldReduceMotion ? undefined : { y: -4, scale: 1.05 }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5] text-sm text-white shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <FaInstagram />
              </motion.a>

              <motion.a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                whileHover={
                  shouldReduceMotion ? undefined : { y: -4, scale: 1.05 }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-sm text-white shadow-sm ring-1 ring-white/30 transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <FaTiktok />
              </motion.a>
            </div>
          </motion.div>

          {/* QUICK LINKS AND CUSTOMER CARE */}
          <motion.div
            variants={fadeUp}
            transition={revealTransition}
            className="grid grid-cols-2 gap-3 sm:gap-5 lg:contents"
          >
            {/* QUICK LINKS */}
            <div className="min-w-0">
              <h3 className="text-sm font-bold sm:text-base">
                Quick Links
              </h3>

              <div className="mt-4 space-y-3 sm:mt-5">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="group flex items-start gap-1.5 text-xs leading-5 text-green-100/70 transition hover:text-white sm:gap-2 sm:text-sm"
                  >
                    <FaArrowRight className="mt-1 shrink-0 text-[9px] opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* CUSTOMER CARE */}
            <div className="min-w-0">
              <h3 className="text-sm font-bold sm:text-base">
                Customer Care
              </h3>

              <div className="mt-4 space-y-3 sm:mt-5">
                {customerLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="group flex items-start gap-1.5 text-xs leading-5 text-green-100/70 transition hover:text-white sm:gap-2 sm:text-sm"
                  >
                    <FaArrowRight className="mt-1 shrink-0 text-[9px] opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-4 sm:mt-5">
                <FaqModal />
              </div>
            </div>
          </motion.div>

          {/* CONTACT */}
          <motion.div
            variants={fadeUp}
            transition={revealTransition}
            className="min-w-0"
          >
            <h3 className="text-base font-bold">Get in Touch</h3>

            <p className="mt-4 text-sm leading-6 text-green-100/70">
              Have a question about a product or order? Get in touch with us.
            </p>

            <div className="mt-5 space-y-4">
              <a
                href="mailto:support@shophub.com"
                className="flex items-start gap-3 text-sm text-green-100/75 transition hover:text-white"
              >
                <FaEnvelope className="mt-1 shrink-0 text-green-300" />
                <span className="break-all">support@shophub.com</span>
              </a>

              <a
                href="tel:+923001234567"
                className="flex items-start gap-3 text-sm text-green-100/75 transition hover:text-white"
              >
                <FaPhoneAlt className="mt-1 shrink-0 text-green-300" />
                <span>+92 300 1234567</span>
              </a>

              <div className="flex items-start gap-3 text-sm text-green-100/75">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-green-300" />
                <span>Pakistan</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          transition={revealTransition}
          className="mx-auto flex max-w-350 flex-col gap-4 px-4 py-5 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-12"
        >
          <p className="text-xs leading-5 text-green-100/60 sm:text-sm">
            © {new Date().getFullYear()} ShopHub. All rights reserved.
          </p>

          <LegalModals />
        </motion.div>
      </div>

      {/* FLOATING WHATSAPP SUPPORT */}
      <motion.a
        href="https://wa.me/923001234567?text=Hi%20ShopHub%2C%20I%20need%20help%20with%20an%20order."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with ShopHub on WhatsApp"
        title="Chat with ShopHub on WhatsApp"
        initial={
          shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }
        }
        animate={{ opacity: 1, scale: 1 }}
        whileHover={
          shouldReduceMotion ? undefined : { y: -4, scale: 1.04 }
        }
        whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.3,
          ease: "easeOut",
        }}
        className="fixed bottom-7 right-4 z-70 flex h-11 w-12 items-center justify-center rounded-full bg-[#25D366] text-2xl ring-1 ring-black/10 transition hover:bg-[#1fb95b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:gap-2 sm:rounded-full sm:px-5 sm:py-3 sm:text-base"
      >
        <FaWhatsapp />
      </motion.a>
    </footer>
  );
}
