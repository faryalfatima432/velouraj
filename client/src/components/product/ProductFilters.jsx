
import { useState } from "react";
import {
  FaChevronDown,
  FaFilter,
} from "react-icons/fa";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";

function ProductFilters({
  category,
  minPrice,
  maxPrice,
  sort,
  categories,
  onFilterChange,
}) {
  const [priceOpen, setPriceOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // ==========================================
  // ANIMATION SETTINGS
  // ==========================================

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -8,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -6,
      scale: 0.98,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  // ==========================================
  // UPDATE FILTER
  // ==========================================

  const updateFilter = (key, value) => {
    onFilterChange({
      category,
      minPrice,
      maxPrice,
      sort,
      [key]: value,
    });
  };

  // ==========================================
  // PRICE FILTER
  // ==========================================

  const handlePriceChange = (min, max) => {
    onFilterChange({
      category,
      minPrice: min,
      maxPrice: max,
      sort,
    });

    setPriceOpen(false);
  };

  const hasPriceFilter =
    minPrice !== "" || maxPrice !== "";

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? false
          : { opacity: 0, y: 12 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
    >
      {/* ======================================
          FILTER LABEL
      ====================================== */}

      <motion.div
        initial={
          shouldReduceMotion
            ? false
            : { opacity: 0, x: -8 }
        }
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="hidden items-center gap-2 text-sm font-semibold text-slate-700 sm:flex"
      >
        <FaFilter className="text-orange-500" />
        <span>Filter By</span>
      </motion.div>

      {/* ======================================
          CATEGORY
      ====================================== */}

      <motion.div
        whileHover={
          shouldReduceMotion ? undefined : { y: -1 }
        }
        className="relative w-full sm:w-auto sm:min-w-45"
      >
        <select
          value={category}
          onChange={(event) =>
            updateFilter("category", event.target.value)
          }
          className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-orange-400 focus:border-orange-500"
        >
          <option value="">All Categories</option>

          {categories.map((item) => (
            <option key={item._id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
      </motion.div>

      {/* ======================================
          PRICE
      ====================================== */}

      <motion.div
        whileHover={
          shouldReduceMotion ? undefined : { y: -1 }
        }
        className="relative w-full sm:w-auto sm:min-w-42.5"
      >
        <motion.button
          type="button"
          onClick={() => setPriceOpen(!priceOpen)}
          aria-expanded={priceOpen}
          aria-haspopup="true"
          whileTap={
            shouldReduceMotion ? undefined : { scale: 0.98 }
          }
          className={`flex w-full items-center justify-between gap-4 rounded-lg border bg-white px-4 py-2.5 text-sm font-medium transition ${
            hasPriceFilter
              ? "border-orange-500 text-orange-600"
              : "border-slate-200 text-slate-700 hover:border-orange-400"
          }`}
        >
          <span>
            {hasPriceFilter
              ? `Rs. ${minPrice || 0} - ${maxPrice || "∞"}`
              : "Price"}
          </span>

          <motion.span
            animate={{ rotate: priceOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            <FaChevronDown className="text-xs text-slate-400" />
          </motion.span>
        </motion.button>

        {/* PRICE DROPDOWN */}

        <AnimatePresence>
          {priceOpen && (
            <motion.div
              variants={dropdownVariants}
              initial={shouldReduceMotion ? false : "hidden"}
              animate="visible"
              exit={shouldReduceMotion ? undefined : "exit"}
              className="absolute left-0 top-full z-50 mt-2 w-full min-w-70 rounded-xl border border-slate-200 bg-white p-4 shadow-xl"
            >
              <h3 className="mb-3 text-sm font-bold text-slate-800">
                Price Range
              </h3>

              {/* CUSTOM PRICE */}

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min price"
                  value={minPrice}
                  onChange={(event) =>
                    onFilterChange({
                      category,
                      minPrice: event.target.value,
                      maxPrice,
                      sort,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-orange-500"
                />

                <input
                  type="number"
                  min="0"
                  placeholder="Max price"
                  value={maxPrice}
                  onChange={(event) =>
                    onFilterChange({
                      category,
                      minPrice,
                      maxPrice: event.target.value,
                      sort,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-orange-500"
                />
              </div>

              {/* PRESET PRICES */}

              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  {
                    label: "Under Rs. 1,000",
                    min: "",
                    max: "1000",
                  },
                  {
                    label: "Rs. 1,000 - 5,000",
                    min: "1000",
                    max: "5000",
                  },
                  {
                    label: "Rs. 5,000 - 10,000",
                    min: "5000",
                    max: "10000",
                  },
                  {
                    label: "Rs. 10,000+",
                    min: "10000",
                    max: "",
                  },
                ].map((range, index) => (
                  <motion.button
                    key={range.label}
                    type="button"
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, y: 5 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: shouldReduceMotion ? 0 : index * 0.04,
                    }}
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : { scale: 1.02 }
                    }
                    whileTap={
                      shouldReduceMotion
                        ? undefined
                        : { scale: 0.97 }
                    }
                    onClick={() =>
                      handlePriceChange(range.min, range.max)
                    }
                    className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-medium text-slate-600 transition hover:border-orange-400 hover:text-orange-500"
                  >
                    {range.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ======================================
          SORT
      ====================================== */}

      <motion.div
        whileHover={
          shouldReduceMotion ? undefined : { y: -1 }
        }
        className="relative w-full sm:w-auto sm:min-w-45"
      >
        <select
          value={sort}
          onChange={(event) =>
            updateFilter("sort", event.target.value)
          }
          className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-orange-400 focus:border-orange-500"
        >
          <option value="">Sort By</option>

          <option value="price-low">
            Price: Low to High
          </option>

          <option value="price-high">
            Price: High to Low
          </option>

          <option value="rating">
            Highest Rated
          </option>

          <option value="newest">
            Newest
          </option>
        </select>

        <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
      </motion.div>
    </motion.div>
  );
}

export default ProductFilters;
