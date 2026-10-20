import { Link } from "react-router-dom";
import {
  FaTruck,
  FaShieldAlt,
  FaHeart,
  FaHeadset,
  FaCheckCircle,
  FaArrowRight,
  FaBoxOpen,
  FaShoppingBag,
  FaStar,
  FaLeaf,
} from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";

import aboutHero from "../../assets/images/hero1.jpeg";

const benefits = [
  {
    icon: FaTruck,
    title: "Convenient Delivery",
    description:
      "Shop from home and get your favorite products delivered to your doorstep.",
    number: "01",
  },
  {
    icon: FaShieldAlt,
    title: "Secure Shopping",
    description:
      "Enjoy a smooth shopping experience with a focus on secure order processing.",
    number: "02",
  },
  {
    icon: FaHeart,
    title: "Quality Products",
    description:
      "Explore a carefully selected collection of products for your everyday needs.",
    number: "03",
  },
  {
    icon: FaHeadset,
    title: "Customer Support",
    description:
      "We aim to make every shopping experience simple, helpful, and convenient.",
    number: "04",
  },
];

const values = [
  {
    number: "01",
    title: "Quality First",
    description:
      "We focus on products that offer practical value and a satisfying shopping experience.",
  },
  {
    number: "02",
    title: "Trust & Transparency",
    description:
      "Clear product information and straightforward shopping help customers make informed choices.",
  },
  {
    number: "03",
    title: "Simple by Design",
    description:
      "We make it easier to explore products, compare options, and shop in one place.",
  },
];

const stats = [
  { value: "Easy", label: "Product Discovery", icon: FaShoppingBag },
  { value: "Simple", label: "Shopping Experience", icon: FaCheckCircle },
  { value: "Customer", label: "Focused Service", icon: FaHeart },
];

const viewportSettings = { once: true, amount: 0.2 };

function createMotionSettings(reduceMotion) {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: viewportSettings,
    transition: { duration: 0.55, ease: "easeOut" },
  };
}

export default function About() {
  const reduceMotion = useReducedMotion();

  const sectionMotion = createMotionSettings(reduceMotion);
  const staggerContainer = {
    hidden: {},
    visible: {
      transition: reduceMotion
        ? { duration: 0 }
        : { staggerChildren: 0.12, delayChildren: 0.08 },
    },
  };
  const staggerItem = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.45, ease: "easeOut" },
    },
  };

  return (
    <main className="overflow-hidden bg-white text-gray-800">
      {/* HERO SECTION */}
      <section className="relative bg-[#edf6f0]">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 top-10 h-64 w-64 rounded-full bg-green-200/40 blur-3xl"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-white/80 blur-3xl"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 md:gap-14 md:py-20 lg:grid-cols-2 lg:px-10 lg:py-24">
          {/* Hero Content */}
          <motion.div
            className="order-2 lg:order-1"
            initial={reduceMotion ? false : { opacity: 0, x: -35 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#17633a] shadow-sm sm:text-sm"
              whileHover={reduceMotion ? undefined : { y: -2 }}
            >
              <FaLeaf />
              A little about ShopHub
            </motion.div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl xl:text-7xl">
              Your everyday shopping,
              <motion.span
                className="mt-2 block text-[#17633a]"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
              >
                made better.
              </motion.span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
              ShopHub brings everyday shopping essentials together in one
              convenient place. Explore our collection, discover new
              favorites, and enjoy a simpler way to shop online.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                <Link
                  to="/products"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#17633a] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-900/10 transition duration-300 hover:bg-[#12532f] hover:shadow-xl sm:px-6 sm:text-base"
                >
                  Explore Products
                  <motion.span
                    className="inline-flex"
                    whileHover={reduceMotion ? undefined : { x: 4 }}
                  >
                    <FaArrowRight />
                  </motion.span>
                </Link>
              </motion.div>

              <motion.a
                href="#our-story"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-5 py-3.5 text-sm font-bold text-gray-700 transition duration-300 hover:border-[#17633a] hover:text-[#17633a] sm:px-6 sm:text-base"
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                Our Story
              </motion.a>
            </div>

            <motion.div
              className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-gray-600 sm:gap-x-6 sm:text-sm"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.span className="flex items-center gap-2" variants={staggerItem}>
                <FaCheckCircle className="shrink-0 text-[#17633a]" />
                Easy Shopping
              </motion.span>
              <motion.span className="flex items-center gap-2" variants={staggerItem}>
                <FaCheckCircle className="shrink-0 text-[#17633a]" />
                Customer Focused
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="order-1 lg:order-2"
            initial={reduceMotion ? false : { opacity: 0, x: 35, scale: 0.97 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
          >
            <div className="relative mx-auto w-full max-w-xl">
              <motion.div
                aria-hidden="true"
                className="absolute -right-3 -top-3 h-24 w-24 rounded-full border border-green-300/60 sm:-right-5 sm:-top-5 sm:h-32 sm:w-32"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-green-300/40 blur-2xl sm:h-32 sm:w-32" />

              <motion.div
                className="relative overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl shadow-green-950/10 sm:rounded-3xl sm:border-8"
                whileHover={reduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  src={aboutHero}
                  alt="Explore the ShopHub online shopping collection"
                  className="h-64 w-full object-cover sm:h-80 md:h-96 lg:h-112.5"
                  whileHover={reduceMotion ? undefined : { scale: 1.035 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />

                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-gray-950/35 via-transparent to-transparent" />

                <motion.div
                  className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/70 bg-white/95 p-3 shadow-xl backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-5 sm:rounded-2xl sm:p-4"
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf6f0] text-xl text-[#17633a] sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl">
                      <FaBoxOpen />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 sm:text-base">
                        Your Shopping Destination
                      </p>
                      <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                        Discover more. Shop with ease.
                      </p>
                    </div>

                    <div className="ml-auto hidden shrink-0 items-center gap-1 rounded-full bg-[#edf6f0] px-3 py-2 text-xs font-bold text-[#17633a] sm:flex">
                      <FaStar />
                      Shop Smart
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <motion.section
        className="relative z-10 mx-auto -mt-1 max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-10"
        {...sectionMotion}
      >
        <motion.div
          className="grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-900/4 sm:grid-cols-3 sm:rounded-3xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                className={`flex items-center gap-4 px-5 py-5 sm:justify-center sm:px-4 sm:py-7 ${
                  index !== stats.length - 1
                    ? "border-b border-gray-100 sm:border-b-0 sm:border-r"
                    : ""
                }`}
              >
                <motion.div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf6f0] text-lg text-[#17633a] sm:h-14 sm:w-14 sm:rounded-2xl sm:text-xl"
                  whileHover={reduceMotion ? undefined : { rotate: 5, scale: 1.06 }}
                >
                  <Icon />
                </motion.div>

                <div>
                  <h3 className="text-lg font-extrabold text-gray-900 sm:text-xl">
                    {stat.value}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* OUR STORY */}
      <motion.section
        id="our-story"
        className="scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24"
        {...sectionMotion}
      >
        <motion.div className="mx-auto max-w-7xl">
          <motion.div className="mx-auto max-w-3xl text-center" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportSettings}>
            <motion.span
              className="inline-flex items-center gap-2 rounded-full bg-[#edf6f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#17633a] sm:text-sm"
              variants={staggerItem}
            >
              <FaHeart />
              Our Story
            </motion.span>

            <motion.h2
              className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
              variants={staggerItem}
            >
              Shopping made simple,
              <span className="block text-[#17633a]">all in one place.</span>
            </motion.h2>

            <motion.p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8" variants={staggerItem}>
              ShopHub is built around a simple idea: online shopping should
              be convenient, easy to navigate, and enjoyable. We want to help
              customers explore useful products, discover new favorites,
              and make informed shopping choices.
            </motion.p>

            <motion.p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8" variants={staggerItem}>
              Our focus is on a user-friendly website, thoughtful product
              selection, and a customer-first approach that makes shopping
              feel straightforward from browsing to checkout.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* BENEFITS */}
      <motion.section
        className="relative bg-gray-50 px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24"
        {...sectionMotion}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-green-100/70 blur-3xl"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={viewportSettings}
          transition={{ duration: 0.8 }}
        />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
          >
            <motion.span
              className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#17633a] shadow-sm sm:text-sm"
              variants={staggerItem}
            >
              Why ShopHub
            </motion.span>

            <motion.h2
              className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
              variants={staggerItem}
            >
              A better way to shop
            </motion.h2>

            <motion.p
              className="mt-4 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8"
              variants={staggerItem}
            >
              Every detail matters. We focus on making your shopping journey
              convenient, clear, and enjoyable.
            </motion.p>
          </motion.div>

          {/* Two columns on mobile, four on desktop */}
          <motion.div
            className="mt-9 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4 lg:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
          >
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <motion.article
                  key={benefit.title}
                  variants={staggerItem}
                  whileHover={reduceMotion ? undefined : { y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-colors duration-300 hover:border-green-200 hover:shadow-xl hover:shadow-green-950/6 sm:rounded-3xl sm:p-6 lg:p-7"
                >
                  <motion.span
                    className="absolute right-4 top-4 text-xs font-bold tracking-wider text-gray-300 transition-colors group-hover:text-green-700/50 sm:right-6 sm:top-6"
                    whileHover={reduceMotion ? undefined : { scale: 1.1 }}
                  >
                    {benefit.number}
                  </motion.span>

                  <motion.div
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf6f0] text-lg text-[#17633a] transition-colors duration-300 group-hover:bg-[#17633a] group-hover:text-white sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl"
                    whileHover={reduceMotion ? undefined : { rotate: -5, scale: 1.08 }}
                  >
                    <Icon />
                  </motion.div>

                  <h3 className="mt-5 text-sm font-extrabold leading-snug text-gray-900 sm:mt-6 sm:text-lg">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 flex-1 text-xs leading-6 text-gray-600 sm:text-sm sm:leading-7">
                    {benefit.description}
                  </p>

                  <motion.div
                    className="mt-5 h-1 w-9 rounded-full bg-green-200 sm:mt-6"
                    whileHover={reduceMotion ? undefined : { width: 64 }}
                    transition={{ duration: 0.25 }}
                  />
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* OUR VALUES */}
      <motion.section
        className="px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24"
        {...sectionMotion}
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-start lg:gap-20">
          <motion.div
            className="lg:sticky lg:top-24"
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={viewportSettings}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <span className="inline-flex rounded-full bg-[#edf6f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#17633a] sm:text-sm">
              What Matters to Us
            </span>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              The values behind
              <span className="block text-[#17633a]">ShopHub.</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
              A great online store should help customers feel informed and
              comfortable while shopping. These values guide how we approach
              our products, website, and customer experience.
            </p>

            <motion.div
              whileHover={reduceMotion ? undefined : { x: 4 }}
              className="inline-flex"
            >
              <Link
                to="/products"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#17633a] transition hover:text-[#12532f] sm:text-base"
              >
                Discover our collection
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white px-5 shadow-sm sm:rounded-3xl sm:px-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
          >
            {values.map((value, index) => (
              <motion.article
                key={value.number}
                variants={staggerItem}
                whileHover={reduceMotion ? undefined : { x: 4 }}
                className={`group flex gap-4 py-6 sm:gap-6 sm:py-8 ${
                  index !== values.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <motion.div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf6f0] text-sm font-extrabold text-[#17633a] transition-colors duration-300 group-hover:bg-[#17633a] group-hover:text-white sm:h-14 sm:w-14 sm:rounded-2xl sm:text-base"
                  whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                >
                  {value.number}
                </motion.div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-extrabold text-gray-900 sm:text-xl">
                    {value.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    {value.description}
                  </p>
                </div>

                <motion.span
                  className="mt-1 hidden shrink-0 text-sm text-green-700/40 sm:block"
                  whileHover={reduceMotion ? undefined : { x: 4 }}
                >
                  <FaArrowRight />
                </motion.span>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CALL TO ACTION */}
      <motion.section
        className="px-4 pb-14 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24"
        {...sectionMotion}
      >
        <motion.div
          className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#17633a] px-5 py-12 text-center shadow-xl shadow-green-950/10 sm:rounded-3xl sm:px-10 sm:py-16 lg:px-16 lg:py-20"
          whileHover={reduceMotion ? undefined : { y: -3 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-35 border-white/6 sm:h-80 sm:w-80"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full border-35 border-white/6 sm:h-80 sm:w-80"
            animate={reduceMotion ? undefined : { rotate: -360 }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            className="relative mx-auto max-w-3xl"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
          >
            <motion.div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl text-white sm:h-16 sm:w-16 sm:text-3xl"
              variants={staggerItem}
              whileHover={reduceMotion ? undefined : { rotate: 8, scale: 1.05 }}
            >
              <FaHeart />
            </motion.div>

            <motion.p
              className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-green-100 sm:text-sm"
              variants={staggerItem}
            >
              Your next favorite is waiting
            </motion.p>

            <motion.h2
              className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
              variants={staggerItem}
            >
              Ready to discover something new?
            </motion.h2>

            <motion.p
              className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-green-100 sm:text-base sm:leading-8"
              variants={staggerItem}
            >
              Explore our collection and discover products that fit your
              everyday needs. Your next shopping experience starts here.
            </motion.p>

            <motion.div
              variants={staggerItem}
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="inline-flex"
            >
              <Link
                to="/products"
                className="group mt-7 inline-flex items-center justify-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-[#17633a] shadow-lg transition duration-300 hover:bg-green-50 hover:shadow-xl sm:mt-9 sm:px-8 sm:py-4 sm:text-base"
              >
                Start Shopping
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}
