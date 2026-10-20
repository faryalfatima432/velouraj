import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import {
  FaArrowRight,
  FaShippingFast,
  FaShieldAlt,
  FaHeadset,
  FaUndo,
  FaChevronLeft,
  FaChevronRight,
  FaFire,
} from "react-icons/fa";

import API from "../services/api";
import ProductCard from "../components/product/ProductCard";

import heroOne from "../assets/images/hero1.jpeg";
import heroTwo from "../assets/images/hero2.jpeg";
import heroThree from "../assets/images/hero3.jpeg";
import heroFour from "../assets/images/hero4.jpeg";
import heroFive from "../assets/images/hero5.jpeg";
import heroSix from "../assets/images/hero6.jpeg";

/*
==================================================
ANIMATION VARIANTS
==================================================
*/

const revealVariants = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const heroVariants = {
  initial: {
    opacity: 0,
    scale: 1.015,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.35,
      ease: "easeInOut",
    },
  },
};

/*
==================================================
HERO SLIDES
==================================================
*/

const heroSlides = [
  {
    image: heroOne,
    imageAlt: "ShopHub collection",
  },
  {
    image: heroTwo,
    imageAlt: "ShopHub products",
  },
  {
    image: heroThree,
    imageAlt: "ShopHub featured collection",
  },
  {
    image: heroFour,
    imageAlt: "ShopHub new collection",
  },
  {
    image: heroFive,
    imageAlt: "ShopHub special collection",
  },
  {
    image: heroSix,
    imageAlt: "ShopHub products collection",
  },
];

/*
==================================================
REVEAL ANIMATION WRAPPER
==================================================
*/

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: {
          opacity: 0,
          y: reduceMotion ? 0 : 22,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: reduceMotion ? 0 : 0.5,
            delay: reduceMotion ? 0 : delay,
            ease: "easeOut",
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/*
==================================================
HOME
==================================================
*/

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [heroIndex, setHeroIndex] = useState(0);

  const reduceMotion = useReducedMotion();

  /*
  ==================================================
  FETCH PRODUCTS
  ==================================================
  */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);

        const response = await API.get("/products");

        if (response.data.success) {
          setProducts(response.data.products || []);
        }
      } catch (error) {
        console.error(
          "HOME PRODUCTS ERROR:",
          error.response?.data?.message || error.message
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  /*
  ==================================================
  FETCH CATEGORIES
  ==================================================
  */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const response = await API.get("/categories");

        if (response.data.success) {
          setCategories(response.data.categories || []);
        }
      } catch (error) {
        console.error(
          "HOME CATEGORIES ERROR:",
          error.response?.data?.message || error.message
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /*
  ==================================================
  AUTO HERO SLIDER
  ==================================================
  */

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((previous) =>
        previous === heroSlides.length - 1 ? 0 : previous + 1
      );
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  /*
  ==================================================
  HERO CONTROLS
  ==================================================
  */

  const previousHero = () => {
    setHeroIndex((previous) =>
      previous === 0 ? heroSlides.length - 1 : previous - 1
    );
  };

  const nextHero = () => {
    setHeroIndex((previous) =>
      previous === heroSlides.length - 1 ? 0 : previous + 1
    );
  };

  const currentHero = heroSlides[heroIndex];

  /*
  ==================================================
  PRODUCT SECTIONS
  ==================================================
  */

  const featuredProducts = products.slice(0, 10);

  const saleProducts = products
    .filter(
      (product) =>
        Number(product.discountPercentage || 0) > 0 ||
        (product.salePrice &&
          Number(product.salePrice) < Number(product.price))
    )
    .slice(0, 10);

  const newProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    .slice(0, 10);

  return (
    <main className="bg-white">

      {/* ==================================================
          HERO SECTION
      ================================================== */}

      <section className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        <Reveal className="mx-auto max-w-[1600px]">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">

            {/* HERO IMAGE ONLY - ORIGINAL LAYOUT PRESERVED */}

            <Link
              to="/products"
              className="block aspect-[1.45/1] overflow-hidden sm:aspect-[2.4/1] lg:aspect-3/1"
            >
              <AnimatePresence mode="sync" initial={false}>
                <motion.img
                  key={currentHero.image}
                  src={currentHero.image}
                  alt={currentHero.imageAlt}
                  variants={heroVariants}
                  initial={reduceMotion ? false : "initial"}
                  animate="animate"
                  exit="exit"
                  className="h-full w-full object-cover transition-all duration-700"
                />
              </AnimatePresence>
            </Link>

            {/* PREVIOUS BUTTON */}

            <motion.button
              type="button"
              onClick={previousHero}
              aria-label="Previous slide"
              whileHover={reduceMotion ? undefined : { scale: 1.08 }}
              whileTap={reduceMotion ? undefined : { scale: 0.94 }}
              className="
                absolute
                left-2
                top-1/2
                z-20
                flex
                h-8
                w-8
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/95
                text-[#17633a]
                shadow-md
                transition
                hover:bg-[#17633a]
                hover:text-white
                sm:left-4
                sm:h-10
                sm:w-10
              "
            >
              <FaChevronLeft className="text-xs sm:text-sm" />
            </motion.button>

            {/* NEXT BUTTON */}

            <motion.button
              type="button"
              onClick={nextHero}
              aria-label="Next slide"
              whileHover={reduceMotion ? undefined : { scale: 1.08 }}
              whileTap={reduceMotion ? undefined : { scale: 0.94 }}
              className="
                absolute
                right-2
                top-1/2
                z-20
                flex
                h-8
                w-8
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/95
                text-[#17633a]
                shadow-md
                transition
                hover:bg-[#17633a]
                hover:text-white
                sm:right-4
                sm:h-10
                sm:w-10
              "
            >
              <FaChevronRight className="text-xs sm:text-sm" />
            </motion.button>

            {/* DOTS */}

            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:bottom-5 sm:gap-2">
              {heroSlides.map((_, index) => (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => setHeroIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  whileTap={reduceMotion ? undefined : { scale: 0.85 }}
                  className={`
                    h-1.5
                    rounded-full
                    transition-all
                    sm:h-2
                    ${
                      heroIndex === index
                        ? "w-6 bg-[#17633a] sm:w-8"
                        : "w-1.5 bg-white/90 sm:w-2"
                    }
                  `}
                />
              ))}
            </div>

          </div>
        </Reveal>
      </section>

      {/* ==================================================
          CATEGORIES
      ================================================== */}

      <section className="border-b border-slate-100 bg-white">
        <Reveal>
          <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#17633a] sm:text-xs">
                  Explore
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                  Shop by Category
                </h2>
              </div>

              <Link
                to="/products"
                className="
                  hidden
                  items-center
                  gap-2
                  text-xs
                  font-semibold
                  text-slate-600
                  transition
                  hover:text-[#17633a]
                  sm:flex
                "
              >
                View All
                <FaArrowRight />
              </Link>

            </div>

            {loadingCategories ? (
              <div className="flex gap-5 overflow-hidden">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="min-w-20 text-center sm:min-w-28"
                  >
                    <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-slate-100 sm:h-24 sm:w-24" />

                    <div className="mx-auto mt-3 h-3 w-16 animate-pulse rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="flex gap-5 overflow-x-auto pb-3 sm:justify-between sm:gap-6">
                {categories.slice(0, 8).map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, y: 16, scale: 0.96 }
                    }
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.4,
                      delay: reduceMotion ? 0 : index * 0.055,
                      ease: "easeOut",
                    }}
                    whileHover={reduceMotion ? undefined : { y: -4 }}
                    className="min-w-19 text-center sm:min-w-25"
                  >
                    <Link
                      to={`/products?category=${encodeURIComponent(
                        category.name
                      )}`}
                      className="group block text-center"
                    >
                      <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200 transition duration-300 group-hover:ring-2 group-hover:ring-[#17633a] sm:h-24 sm:w-24">
                        {category.image ? (
                          <motion.img
                            src={category.image}
                            alt={category.name}
                            loading="lazy"
                            whileHover={
                              reduceMotion ? undefined : { scale: 1.1 }
                            }
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-slate-400">
                            {category.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <h3 className="mt-3 line-clamp-2 text-xs font-semibold text-slate-700 transition group-hover:text-[#17633a] sm:text-sm">
                        {category.name}
                      </h3>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-500">
                  Categories will appear here once you add
                  them from the admin panel.
                </p>
              </div>
            )}

          </div>
        </Reveal>
      </section>

      {/* ==================================================
          FEATURED PRODUCTS
      ================================================== */}

      <section className="bg-slate-50 py-12 sm:py-16">
        <Reveal>
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">

            <SectionHeading
              eyebrow="SHOPHUB PICKS"
              title="Featured Products"
              description="Popular products selected for you."
            />

            {loadingProducts ? (
              <ProductSkeleton />
            ) : featuredProducts.length > 0 ? (
              <ProductGrid products={featuredProducts} />
            ) : (
              <EmptyProducts />
            )}

            <div className="mt-8 text-center">
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="inline-block"
              >
                <Link
                  to="/products"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-[#17633a]
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#12532f]
                  "
                >
                  View All Products
                  <FaArrowRight />
                </Link>
              </motion.div>
            </div>

          </div>
        </Reveal>
      </section>

      {/* ==================================================
          PROMOTIONAL BANNER
      ================================================== */}

      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-[1600px] overflow-hidden rounded-2xl bg-[#17633a]">

            <div className="relative px-6 py-12 sm:px-10 lg:px-16 lg:py-16">

              <div className="absolute right-0 top-0 h-full w-1/2 bg-linear-to-l from-white/10 to-transparent" />

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.55,
                  ease: "easeOut",
                }}
                className="relative max-w-2xl"
              >

                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs">
                  <FaFire />
                  Special Offers
                </span>

                <h2 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                  Great Deals.
                  <span className="block text-green-100">
                    Better Prices.
                  </span>
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-green-50/90 sm:text-base">
                  Discover selected products at special prices
                  and save more on your next ShopHub order.
                </p>

                <motion.div
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="mt-7 inline-block"
                >
                  <Link
                    to="/products"
                    className="
                      inline-flex
                      items-center
                      gap-3
                      rounded-lg
                      bg-white
                      px-6
                      py-3.5
                      text-sm
                      font-bold
                      text-[#17633a]
                      transition
                      hover:bg-green-50
                    "
                  >
                    Shop Deals
                    <FaArrowRight />
                  </Link>
                </motion.div>

              </motion.div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ==================================================
          SALE PRODUCTS
      ================================================== */}

      {saleProducts.length > 0 && (
        <section className="py-12 sm:py-16">
          <Reveal>
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">

              <SectionHeading
                eyebrow="LIMITED DEALS"
                title="Deals You Don't Want to Miss"
                description="Grab discounted products before they're gone."
                icon={<FaFire />}
              />

              <ProductGrid products={saleProducts} />

            </div>
          </Reveal>
        </section>
      )}

      {/* ==================================================
          NEW ARRIVALS
      ================================================== */}

      {newProducts.length > 0 && (
        <section className="bg-slate-50 py-12 sm:py-16">
          <Reveal>
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">

              <SectionHeading
                eyebrow="JUST ARRIVED"
                title="New Arrivals"
                description="Fresh products recently added to ShopHub."
              />

              <ProductGrid products={newProducts} />

            </div>
          </Reveal>
        </section>
      )}

      {/* ==================================================
          WHY SHOP WITH US
      ================================================== */}

      <section className="border-y border-slate-200 bg-white py-12 sm:py-16">
        <Reveal>
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">

            <div className="mx-auto mb-10 max-w-xl text-center">

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#17633a] sm:text-xs">
                Shop With Confidence
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Why Shop With ShopHub?
              </h2>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">

              <ServiceCard
                icon={<FaShippingFast />}
                title="Fast Delivery"
                description="Get your orders delivered quickly and safely."
              />

              <ServiceCard
                icon={<FaShieldAlt />}
                title="Secure Shopping"
                description="Your account and order information stay protected."
              />

              <ServiceCard
                icon={<FaHeadset />}
                title="Customer Support"
                description="We're here to help whenever you need us."
              />

              <ServiceCard
                icon={<FaUndo />}
                title="Easy Returns"
                description="Simple and convenient return process."
              />

            </div>
          </div>
        </Reveal>
      </section>

      {/* NEWSLETTER SECTION LEFT UNCHANGED */}

    </main>
  );
}

/*
==================================================
SECTION HEADING
==================================================
*/

function SectionHeading({
  eyebrow,
  title,
  description,
  icon,
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4 sm:mb-8">

      <div>
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#17633a] sm:text-xs">
          {icon}
          {eyebrow}
        </p>

        <h2 className="mt-1.5 text-xl font-bold text-slate-900 sm:text-3xl">
          {title}
        </h2>

        <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
          {description}
        </p>
      </div>

      <Link
        to="/products"
        className="
          hidden
          shrink-0
          items-center
          gap-2
          text-sm
          font-semibold
          text-[#17633a]
          transition
          hover:text-[#12532f]
          sm:flex
        "
      >
        View All
        <FaArrowRight />
      </Link>

    </div>
  );
}

/*
==================================================
PRODUCT GRID
==================================================
*/

function ProductGrid({ products }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
        sm:gap-4
        md:grid-cols-3
        lg:grid-cols-5
      "
    >
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: 18 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{
            duration: reduceMotion ? 0 : 0.4,
            delay: reduceMotion ? 0 : (index % 5) * 0.055,
            ease: "easeOut",
          }}
          whileHover={reduceMotion ? undefined : { y: -3 }}
          className="min-w-0"
        >
          <ProductCard
            product={product}
          />
        </motion.div>
      ))}
    </div>
  );
}

/*
==================================================
SERVICE CARD
==================================================
*/

function ServiceCard({
  icon,
  title,
  description,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: 16 }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduceMotion ? 0 : 0.4,
        ease: "easeOut",
      }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-5
        text-center
        transition
        duration-300
        hover:-translate-y-1
        hover:border-[#17633a]
        hover:shadow-lg
        sm:p-6
      "
    >

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#edf6f0] text-xl text-[#17633a]">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-900 sm:text-base">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
        {description}
      </p>

    </motion.div>
  );
}

/*
==================================================
PRODUCT SKELETON
==================================================
*/

function ProductSkeleton() {
  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
        sm:gap-4
        md:grid-cols-3
        lg:grid-cols-5
      "
    >
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white"
        >

          <div className="aspect-square animate-pulse bg-slate-200" />

          <div className="space-y-3 p-3 sm:p-4">

            <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />

            <div className="h-4 animate-pulse rounded bg-slate-200" />

            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />

            <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200" />

            <div className="h-9 animate-pulse rounded bg-slate-200" />

          </div>
        </div>
      ))}
    </div>
  );
}

/*
==================================================
EMPTY PRODUCTS
==================================================
*/

function EmptyProducts() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: 15 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4 }}
      className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center sm:p-12"
    >

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf6f0] text-[#17633a]">
        <FaFire />
      </div>

      <p className="mt-4 text-lg font-semibold text-slate-700">
        No products available yet
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Add products from your admin panel and they
        will automatically appear here.
      </p>

      <motion.div
        whileHover={reduceMotion ? undefined : { y: -2 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        className="mt-6 inline-block"
      >
        <Link
          to="/products"
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            bg-[#17633a]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#12532f]
          "
        >
          Browse Products
          <FaArrowRight />
        </Link>
      </motion.div>

    </motion.div>
  );
}

export default Home;
