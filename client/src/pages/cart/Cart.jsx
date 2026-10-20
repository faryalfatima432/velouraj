import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FaArrowLeft,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaTrash,
} from "react-icons/fa";

import { useCart } from "../../context/CartContext";

function Cart() {
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getItemPrice,
    clearCart,
  } = useCart();

  const prefersReducedMotion = useReducedMotion();

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 24,
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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 18,
      scale: prefersReducedMotion ? 1 : 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.35,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : -20,
      height: 0,
      marginBottom: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.25,
        ease: "easeInOut",
      },
    },
  };

  const buttonMotion = {
    whileHover: prefersReducedMotion ? {} : { scale: 1.03 },
    whileTap: prefersReducedMotion ? {} : { scale: 0.97 },
    transition: { duration: 0.18 },
  };

  if (cartItems.length === 0) {
    return (
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="min-h-[70vh] bg-[#f4f7f3] px-4 py-12 sm:px-6 sm:py-16"
      >
        <div className="mx-auto max-w-4xl">
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-[#e2e9e2] bg-white px-6 py-16 text-center shadow-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.45,
                ease: "backOut",
              }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#edf6f0]"
            >
              <FaShoppingCart className="text-3xl text-[#17633a]" />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-3xl font-bold text-slate-900"
            >
              Your Cart is Empty
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-3 max-w-md text-slate-500"
            >
              You haven't added any products to your shopping cart yet.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-7 inline-block"
              {...buttonMotion}
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-[#17633a] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#12532f]"
              >
                <FaArrowLeft />
                Continue Shopping
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      className="min-h-[70vh] bg-[#f4f7f3] px-4 py-10 sm:px-6 sm:py-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Shopping Cart
            </h1>

            <motion.p
              key={cartCount}
              initial={{
                opacity: 0,
                y: prefersReducedMotion ? 0 : 5,
              }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-slate-500"
            >
              {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
            </motion.p>
          </div>

          <motion.button
            type="button"
            onClick={clearCart}
            {...buttonMotion}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
          >
            <FaTrash />
            Clear Cart
          </motion.button>
        </motion.div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          {/* Cart Items */}
          <motion.div
            variants={containerVariants}
            className="space-y-4"
          >
            <AnimatePresence initial={false}>
              {cartItems.map((item) => {
                const itemPrice = getItemPrice(item);
                const itemTotal = itemPrice * item.quantity;

                return (
                  <motion.div
                    key={item._id}
                    layout={!prefersReducedMotion}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={
                      prefersReducedMotion
                        ? {}
                        : {
                            y: -2,
                            transition: { duration: 0.2 },
                          }
                    }
                    className="overflow-hidden rounded-2xl border border-[#e2e9e2] bg-white p-4 shadow-sm sm:p-5"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row">
                      {/* Image */}
                      <Link
                        to={`/products/${item._id}`}
                        className="shrink-0"
                      >
                        <motion.img
                          src={
                            item.images?.[0] ||
                            "https://via.placeholder.com/150"
                          }
                          alt={item.name}
                          whileHover={
                            prefersReducedMotion ? {} : { scale: 1.04 }
                          }
                          transition={{ duration: 0.25 }}
                          className="h-32 w-full rounded-xl object-cover sm:h-28 sm:w-28"
                        />
                      </Link>

                      {/* Product Information */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex justify-between gap-4">
                          <div>
                            <Link
                              to={`/products/${item._id}`}
                              className="text-lg font-bold text-slate-900 transition-colors hover:text-[#17633a]"
                            >
                              {item.name}
                            </Link>

                            <p className="mt-1 text-sm text-slate-500">
                              {item.category}
                            </p>
                          </div>

                          <motion.button
                            type="button"
                            onClick={() => removeFromCart(item._id)}
                            aria-label={`Remove ${item.name} from cart`}
                            title="Remove"
                            {...buttonMotion}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <FaTrash />
                          </motion.button>
                        </div>

                        {/* Bottom */}
                        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          {/* Quantity */}
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Quantity
                            </p>

                            <div className="flex w-fit items-center overflow-hidden rounded-lg border border-slate-300">
                              <motion.button
                                type="button"
                                onClick={() => decreaseQuantity(item._id)}
                                disabled={item.quantity <= 1}
                                {...buttonMotion}
                                aria-label={`Decrease quantity of ${item.name}`}
                                className="flex h-9 w-9 items-center justify-center text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <FaMinus className="text-xs" />
                              </motion.button>

                              <motion.span
                                key={item.quantity}
                                initial={{
                                  opacity: 0.5,
                                  scale: prefersReducedMotion ? 1 : 0.85,
                                }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.18 }}
                                className="flex h-9 min-w-10 items-center justify-center border-x border-slate-300 px-3 text-sm font-semibold"
                              >
                                {item.quantity}
                              </motion.span>

                              <motion.button
                                type="button"
                                onClick={() => increaseQuantity(item._id)}
                                disabled={item.quantity >= item.stock}
                                {...buttonMotion}
                                aria-label={`Increase quantity of ${item.name}`}
                                className="flex h-9 w-9 items-center justify-center text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <FaPlus className="text-xs" />
                              </motion.button>
                            </div>

                            <p className="mt-1 text-xs text-slate-400">
                              {item.stock} available
                            </p>
                          </div>

                          {/* Price */}
                          <div className="text-left sm:text-right">
                            <p className="text-xs text-slate-400">Price</p>

                            <p className="font-semibold text-slate-900">
                              Rs. {itemPrice.toLocaleString()}
                            </p>

                            {Number(item.salePrice) > 0 &&
                              Number(item.salePrice) < Number(item.price) && (
                                <p className="text-xs text-slate-400 line-through">
                                  Rs. {Number(item.price).toLocaleString()}
                                </p>
                              )}

                            <motion.p
                              key={itemTotal}
                              initial={{
                                opacity: 0.6,
                                y: prefersReducedMotion ? 0 : 4,
                              }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-1 text-lg font-bold text-[#17633a]"
                            >
                              Rs. {itemTotal.toLocaleString()}
                            </motion.p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Order Summary */}
          <motion.aside
            variants={fadeUp}
            className="h-fit rounded-2xl border border-[#e2e9e2] bg-white p-6 shadow-sm lg:sticky lg:top-6"
          >
            <h2 className="text-xl font-bold text-slate-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Items</span>

                <motion.span
                  key={cartCount}
                  initial={{
                    opacity: 0.5,
                    y: prefersReducedMotion ? 0 : 4,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-medium text-slate-900"
                >
                  {cartCount}
                </motion.span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>

                <motion.span
                  key={cartSubtotal}
                  initial={{
                    opacity: 0.5,
                    y: prefersReducedMotion ? 0 : 4,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-medium text-slate-900"
                >
                  Rs. {cartSubtotal.toLocaleString()}
                </motion.span>
              </div>

              <div className="flex justify-between gap-3 text-sm">
                <span className="text-slate-500">Shipping</span>

                <span className="text-right font-medium text-green-600">
                  Calculated at checkout
                </span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-bold text-slate-900">
                    Total
                  </span>

                  <motion.span
                    key={cartSubtotal}
                    initial={{
                      opacity: 0.5,
                      scale: prefersReducedMotion ? 1 : 0.96,
                    }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-2xl font-bold text-[#17633a]"
                  >
                    Rs. {cartSubtotal.toLocaleString()}
                  </motion.span>
                </div>
              </div>
            </div>

            <motion.div {...buttonMotion}>
              <Link
                to="/checkout"
                className="mt-7 flex w-full items-center justify-center rounded-xl bg-[#17633a] px-5 py-3.5 font-semibold text-white transition-colors hover:bg-[#12532f]"
              >
                Proceed to Checkout
              </Link>
            </motion.div>

            <motion.div {...buttonMotion}>
              <Link
                to="/products"
                className="mt-3 flex w-full items-center justify-center rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </motion.aside>
        </div>
      </div>
    </motion.section>
  );
}

export default Cart;