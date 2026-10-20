import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";

import {
  FaHeart,
  FaRegHeart,
  FaShoppingBag,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";

import ProductCard from "../../components/product/ProductCard";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 22,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.45,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.09,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.35,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.96,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  const buttonMotion = {
    whileHover: prefersReducedMotion ? {} : { scale: 1.03 },
    whileTap: prefersReducedMotion ? {} : { scale: 0.97 },
    transition: { duration: 0.18 },
  };

  // =========================================================
  // LOAD WISHLIST
  // =========================================================

  const loadWishlist = () => {
    try {
      const savedWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      setWishlist(savedWishlist);
    } catch (error) {
      console.error("Wishlist loading error:", error);
      setWishlist([]);
    }
  };

  useEffect(() => {
    loadWishlist();

    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, []);

  // =========================================================
  // CLEAR WISHLIST
  // =========================================================

  const clearWishlist = () => {
    localStorage.removeItem("wishlist");
    setWishlist([]);

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  // =========================================================
  // EMPTY WISHLIST
  // =========================================================

  if (wishlist.length === 0) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        className="min-h-[70vh] bg-[#fafaf7]"
      >
        {/* PAGE HEADER */}
        <motion.div
          variants={fadeUp}
          className="border-b border-[#e7e8e2] bg-white"
        >
          <div className="mx-auto max-w-350 px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{
                  opacity: 0,
                  scale: prefersReducedMotion ? 1 : 0.75,
                }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.4,
                  ease: "backOut",
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf6f0]"
              >
                <FaHeart className="text-lg text-[#17633a]" />
              </motion.div>

              <div>
                <h1 className="text-2xl font-bold text-[#252a25] sm:text-3xl">
                  My Wishlist
                </h1>
                <p className="mt-1 text-sm text-[#777b73]">
                  Save your favorite products for later.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* EMPTY STATE */}
        <div className="mx-auto flex max-w-350 justify-center px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            className="w-full max-w-lg rounded-2xl border border-[#e7e8e2] bg-white px-6 py-12 text-center shadow-sm"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.7,
                rotate: prefersReducedMotion ? 0 : -8,
              }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.45,
                ease: "backOut",
              }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#edf6f0]"
            >
              <FaRegHeart className="text-3xl text-[#17633a]" />
            </motion.div>

            <h2 className="mt-6 text-xl font-bold text-[#252a25]">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#777b73]">
              You haven't added anything to your wishlist yet. Explore our
              products and save the items you love.
            </p>

            <motion.div className="mt-7 inline-block" {...buttonMotion}>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-[#17633a] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#12532f]"
              >
                <FaShoppingBag />
                Browse Products
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // =========================================================
  // WISHLIST PAGE
  // =========================================================

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#fafaf7]"
    >
      {/* HEADER */}
      <motion.section
        variants={fadeUp}
        className="border-b border-[#e7e8e2] bg-white"
      >
        <div className="mx-auto max-w-350 px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Title */}
            <div className="flex items-center gap-3">
              <motion.div
                initial={{
                  opacity: 0,
                  scale: prefersReducedMotion ? 1 : 0.75,
                }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.4,
                  ease: "backOut",
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf6f0]"
              >
                <FaHeart className="text-lg text-[#17633a]" />
              </motion.div>

              <div>
                <h1 className="text-2xl font-bold text-[#252a25] sm:text-3xl">
                  My Wishlist
                </h1>
                <motion.p
                  key={wishlist.length}
                  initial={{
                    opacity: 0.5,
                    y: prefersReducedMotion ? 0 : 5,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-[#777b73]"
                >
                  {wishlist.length} {wishlist.length === 1 ? "item" : "items"}{" "}
                  saved
                </motion.p>
              </div>
            </div>

            {/* Clear Wishlist */}
            <motion.button
              type="button"
              onClick={clearWishlist}
              {...buttonMotion}
              className="flex w-fit items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <FaTrash className="text-xs" />
              Clear Wishlist
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* PRODUCTS */}
      <main className="mx-auto max-w-350 px-4 py-8 sm:px-6 lg:px-8">
        {/* Product Count */}
        <motion.div
          variants={fadeUp}
          className="mb-5 flex items-center justify-between"
        >
          <p className="text-sm font-medium text-[#555c50]">Saved Products</p>

          <motion.div {...buttonMotion}>
            <Link
              to="/products"
              className="flex items-center gap-2 text-sm font-semibold text-[#17633a] transition-colors hover:text-[#12532f]"
            >
              Continue Shopping
              <FaArrowLeft className="rotate-180 text-xs" />
            </Link>
          </motion.div>
        </motion.div>

        {/* PRODUCT GRID */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          <AnimatePresence mode="popLayout">
            {wishlist.map((product) => (
              <motion.div
                key={product._id}
                layout={!prefersReducedMotion}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="min-w-0"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>
    </motion.div>
  );
}

export default Wishlist;
