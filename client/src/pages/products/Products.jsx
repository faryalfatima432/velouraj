
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronRight,
  FaFilter,
  FaTimes,
  FaSlidersH,
  FaCheck,
  FaBoxOpen,
  FaArrowRight,
  FaHome,
} from "react-icons/fa";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";

import API from "../../services/api";
import ProductCard from "../../components/product/ProductCard";

// =========================================================
// HERO IMAGE
// =========================================================

import productsHero from "../../assets/images/hero5.jpeg";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // =========================================================
  // ANIMATION SETTINGS
  // =========================================================

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: "easeOut",
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

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
      transition: { duration: 0.15 },
    },
  };

  const drawerVariants = {
    hidden: { y: "100%" },
    visible: {
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      y: "100%",
      transition: {
        duration: 0.25,
        ease: "easeIn",
      },
    },
  };

  // =========================================================
  // FILTER STATES
  // =========================================================

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );

  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || ""
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );

  const [sort, setSort] = useState(
    searchParams.get("sort") || "newest"
  );

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = {};

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (minPrice !== "") {
        params.minPrice = minPrice;
      }

      if (maxPrice !== "") {
        params.maxPrice = maxPrice;
      }

      if (sort) {
        params.sort = sort;
      }

      // Preserve navbar search functionality.
      const urlSearch = searchParams.get("search");

      if (urlSearch) {
        params.search = urlSearch;
      }

      const response = await API.get("/products", {
        params,
      });

      const productData =
        response.data?.products ||
        response.data?.data ||
        response.data ||
        [];

      setProducts(
        Array.isArray(productData) ? productData : []
      );
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);

      const response = await API.get("/categories");

      const categoryData =
        response.data?.categories ||
        response.data?.data ||
        response.data ||
        [];

      setCategories(
        Array.isArray(categoryData) ? categoryData : []
      );
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================================================
  // LOAD PRODUCTS WHEN FILTERS CHANGE
  // =========================================================

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, sort]);

  // =========================================================
  // ACTIVE FILTER COUNT
  // =========================================================

  const activeFilters = useMemo(() => {
    let count = 0;

    if (selectedCategory) count++;
    if (minPrice !== "") count++;
    if (maxPrice !== "") count++;

    return count;
  }, [selectedCategory, minPrice, maxPrice]);

  // =========================================================
  // UPDATE URL
  // =========================================================

  const updateURL = ({
    category = selectedCategory,
    minimum = minPrice,
    maximum = maxPrice,
    sorting = sort,
  } = {}) => {
    const params = new URLSearchParams();

    const currentSearch = searchParams.get("search");

    if (currentSearch) {
      params.set("search", currentSearch);
    }

    if (category) {
      params.set("category", category);
    }

    if (minimum !== "") {
      params.set("minPrice", minimum);
    }

    if (maximum !== "") {
      params.set("maxPrice", maximum);
    }

    if (sorting && sorting !== "newest") {
      params.set("sort", sorting);
    }

    setSearchParams(params);
  };

  // =========================================================
  // CATEGORY
  // =========================================================

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    updateURL({ category });
  };

  // =========================================================
  // SORT
  // =========================================================

  const handleSortChange = (value) => {
    setSort(value);
    setSortOpen(false);

    updateURL({ sorting: value });
  };

  // =========================================================
  // PRICE
  // =========================================================

  const handlePriceApply = () => {
    updateURL({
      minimum: minPrice,
      maximum: maxPrice,
    });

    setMobileFiltersOpen(false);
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");

    const params = new URLSearchParams();
    const currentSearch = searchParams.get("search");

    if (currentSearch) {
      params.set("search", currentSearch);
    }

    setSearchParams(params);
    setMobileFiltersOpen(false);
  };

  // =========================================================
  // SORT OPTIONS
  // =========================================================

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "priceLow", label: "Price: Low to High" },
    { value: "priceHigh", label: "Price: High to Low" },
    { value: "nameAZ", label: "Name: A to Z" },
    { value: "nameZA", label: "Name: Z to A" },
  ];

  const currentSortLabel =
    sortOptions.find((item) => item.value === sort)?.label ||
    "Newest";

  // =========================================================
  // FILTER CONTENT
  // =========================================================

  const FilterContent = ({ mobile = false }) => {
    return (
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: shouldReduceMotion ? 0 : 0.05,
            },
          },
        }}
        className="space-y-7"
      >
        {/* CATEGORY */}

        <motion.div variants={shouldReduceMotion ? {} : fadeUp}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Categories
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Browse by category
              </p>
            </div>

            {selectedCategory && (
              <button
                type="button"
                onClick={() => handleCategoryChange("")}
                className="text-xs font-semibold text-[#17633a] hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-1">
            {/* ALL PRODUCTS */}

            <motion.button
              type="button"
              onClick={() => handleCategoryChange("")}
              whileHover={
                shouldReduceMotion ? undefined : { x: 3 }
              }
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                selectedCategory === ""
                  ? "bg-[#edf6f0] text-[#17633a]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span
                className={`text-sm ${
                  selectedCategory === ""
                    ? "font-bold"
                    : "font-medium"
                }`}
              >
                All Products
              </span>

              <AnimatePresence>
                {selectedCategory === "" && (
                  <motion.span
                    initial={
                      shouldReduceMotion
                        ? false
                        : { scale: 0, opacity: 0 }
                    }
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-[#17633a] text-white"
                  >
                    <FaCheck className="text-[8px]" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* CATEGORIES */}

            {categoryLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="h-11 animate-pulse rounded-xl bg-gray-100"
                  />
                ))}
              </div>
            ) : categories.length > 0 ? (
              categories.map((category) => {
                const categoryName =
                  typeof category === "string"
                    ? category
                    : category.name;

                const categoryId =
                  typeof category === "string"
                    ? category
                    : category._id || category.name;

                const active =
                  selectedCategory === categoryName;

                return (
                  <motion.button
                    key={categoryId}
                    type="button"
                    onClick={() =>
                      handleCategoryChange(categoryName)
                    }
                    whileHover={
                      shouldReduceMotion ? undefined : { x: 3 }
                    }
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                      active
                        ? "bg-[#edf6f0] text-[#17633a]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        active ? "font-bold" : "font-medium"
                      }`}
                    >
                      {categoryName}
                    </span>

                    <AnimatePresence>
                      {active && (
                        <motion.span
                          initial={
                            shouldReduceMotion
                              ? false
                              : { scale: 0, opacity: 0 }
                          }
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-[#17633a] text-white"
                        >
                          <FaCheck className="text-[8px]" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })
            ) : (
              <p className="px-3 py-2 text-xs text-gray-400">
                No categories available
              </p>
            )}
          </div>
        </motion.div>

        {/* DIVIDER */}

        <motion.div
          variants={shouldReduceMotion ? {} : fadeIn}
          className="h-px bg-gray-100"
        />

        {/* PRICE */}

        <motion.div variants={shouldReduceMotion ? {} : fadeUp}>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900">
              Price Range
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Set your preferred price
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* MIN */}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Min price
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-400">
                  Rs.
                </span>

                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-9 pr-2 text-sm outline-none transition focus:border-[#17633a] focus:ring-2 focus:ring-[#17633a]/10"
                />
              </div>
            </div>

            {/* MAX */}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Max price
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-400">
                  Rs.
                </span>

                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Any"
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-9 pr-2 text-sm outline-none transition focus:border-[#17633a] focus:ring-2 focus:ring-[#17633a]/10"
                />
              </div>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={handlePriceApply}
            whileHover={
              shouldReduceMotion ? undefined : { scale: 1.02 }
            }
            whileTap={
              shouldReduceMotion ? undefined : { scale: 0.98 }
            }
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17633a] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#12532f]"
          >
            Apply Price
            <FaArrowRight className="text-[10px]" />
          </motion.button>
        </motion.div>

        {/* CLEAR FILTERS */}

        <AnimatePresence>
          {activeFilters > 0 && (
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, height: 0 }
              }
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="h-px bg-gray-100" />

              <motion.button
                type="button"
                onClick={clearFilters}
                whileHover={
                  shouldReduceMotion ? undefined : { scale: 1.01 }
                }
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <FaTimes className="text-xs" />
                Clear All Filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE APPLY BUTTON */}

        {mobile && (
          <motion.button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            whileTap={
              shouldReduceMotion ? undefined : { scale: 0.98 }
            }
            className="sticky bottom-0 mt-2 w-full rounded-2xl bg-[#17633a] py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#12532f]"
          >
            Show {products.length} Products
          </motion.button>
        )}
      </motion.div>
    );
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* HERO IMAGE */}

      <section className="bg-white">
        <div className="mx-auto max-w-[1600px] px-4 pt-4 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10">
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, scale: 0.98, y: 12 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
          >
            <motion.img
              src={productsHero}
              alt="ShopHub products"
              initial={
                shouldReduceMotion
                  ? false
                  : { scale: 1.04 }
              }
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-50 w-full object-cover sm:h-65 md:h-80 lg:h-95"
            />

            <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/5 via-transparent to-black/5" />
          </motion.div>
        </div>
      </section>

      {/* BREADCRUMB */}

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="bg-white"
      >
        <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm"
          >
            <Link
              to="/"
              className="group flex items-center gap-2 font-medium text-gray-500 transition hover:text-[#17633a]"
            >
              <FaHome className="text-xs transition group-hover:text-[#17633a]" />
              <span>Home</span>
            </Link>

            <FaChevronRight className="text-[8px] text-gray-300" />

            <span className="font-semibold text-[#17633a]">
              Products
            </span>
          </nav>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* PAGE TITLE */}

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="mb-7"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#17633a]">
                ShopHub Collection
              </p>

              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Explore Our Products
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Find everything you need from our carefully
                selected collection.
              </p>
            </div>

            {/* MOBILE FILTER BUTTON */}

            <motion.button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              whileHover={
                shouldReduceMotion ? undefined : { y: -2 }
              }
              whileTap={
                shouldReduceMotion ? undefined : { scale: 0.98 }
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:border-[#17633a] hover:text-[#17633a] sm:w-auto lg:hidden"
            >
              <FaFilter className="text-xs" />
              Filters

              <AnimatePresence>
                {activeFilters > 0 && (
                  <motion.span
                    initial={
                      shouldReduceMotion
                        ? false
                        : { scale: 0 }
                    }
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#17633a] px-1.5 text-[10px] font-bold text-white"
                  >
                    {activeFilters}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>

        {/* DESKTOP + PRODUCT AREA */}

        <div className="flex items-start gap-7">
          {/* DESKTOP FILTER SIDEBAR */}

          <motion.aside
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, x: -18 }
            }
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="hidden w-64 shrink-0 lg:block"
          >
            <div className="sticky top-24 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {/* SIDEBAR HEADER */}

              <div className="border-b border-gray-100 bg-linear-to-r from-[#edf6f0] to-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17633a] text-white shadow-sm">
                    <FaSlidersH className="text-sm" />
                  </div>

                  <div>
                    <h2 className="text-sm font-extrabold text-gray-900">
                      Filter Products
                    </h2>

                    <p className="mt-0.5 text-xs text-gray-400">
                      Refine your selection
                    </p>
                  </div>
                </div>
              </div>

              {/* SIDEBAR CONTENT */}

              <div className="p-5">
                <FilterContent />
              </div>
            </div>
          </motion.aside>

          {/* PRODUCTS */}

          <motion.section
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 16 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="min-w-0 flex-1"
          >
            {/* TOOLBAR */}

            <div className="mb-5 flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm sm:px-5">
              <div>
                <p className="text-xs text-gray-400">
                  Our collection
                </p>

                <p className="mt-0.5 text-sm font-bold text-gray-900">
                  {loading
                    ? "Loading..."
                    : `${products.length} ${
                        products.length === 1
                          ? "Product"
                          : "Products"
                      }`}
                </p>
              </div>

              {/* SORT */}

              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setSortOpen((prev) => !prev)}
                  whileTap={
                    shouldReduceMotion
                      ? undefined
                      : { scale: 0.98 }
                  }
                  aria-expanded={sortOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 transition hover:border-[#17633a] sm:text-sm"
                >
                  <span className="hidden text-gray-400 sm:inline">
                    Sort by:
                  </span>

                  <span>{currentSortLabel}</span>

                  <motion.span
                    animate={{ rotate: sortOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex"
                  >
                    <FaChevronDown className="text-[9px] text-gray-400" />
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial={
                        shouldReduceMotion ? false : "hidden"
                      }
                      animate="visible"
                      exit={shouldReduceMotion ? undefined : "exit"}
                      className="absolute right-0 top-full z-40 mt-2 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl"
                    >
                      {sortOptions.map((option, index) => (
                        <motion.button
                          key={option.value}
                          type="button"
                          initial={
                            shouldReduceMotion
                              ? false
                              : { opacity: 0, x: 8 }
                          }
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.18,
                            delay: shouldReduceMotion
                              ? 0
                              : index * 0.035,
                          }}
                          onClick={() =>
                            handleSortChange(option.value)
                          }
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                            sort === option.value
                              ? "bg-[#edf6f0] font-bold text-[#17633a]"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {option.label}

                          {sort === option.value && (
                            <FaCheck className="text-[10px]" />
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ACTIVE FILTERS */}

            <AnimatePresence>
              {activeFilters > 0 && (
                <motion.div
                  initial={
                    shouldReduceMotion
                      ? false
                      : { opacity: 0, y: -8 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-5 flex flex-wrap items-center gap-2"
                >
                  <span className="text-xs font-semibold text-gray-400">
                    Active:
                  </span>

                  <AnimatePresence>
                    {selectedCategory && (
                      <motion.button
                        key="category-filter"
                        type="button"
                        initial={
                          shouldReduceMotion
                            ? false
                            : { opacity: 0, scale: 0.9 }
                        }
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => handleCategoryChange("")}
                        className="flex items-center gap-2 rounded-full bg-[#edf6f0] px-3 py-1.5 text-xs font-bold text-[#17633a]"
                      >
                        {selectedCategory}
                        <FaTimes className="text-[8px]" />
                      </motion.button>
                    )}

                    {(minPrice !== "" || maxPrice !== "") && (
                      <motion.button
                        key="price-filter"
                        type="button"
                        initial={
                          shouldReduceMotion
                            ? false
                            : { opacity: 0, scale: 0.9 }
                        }
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => {
                          setMinPrice("");
                          setMaxPrice("");

                          updateURL({
                            minimum: "",
                            maximum: "",
                          });
                        }}
                        className="flex items-center gap-2 rounded-full bg-[#edf6f0] px-3 py-1.5 text-xs font-bold text-[#17633a]"
                      >
                        Price Range
                        <FaTimes className="text-[8px]" />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="ml-1 text-xs font-semibold text-gray-400 hover:text-red-500"
                  >
                    Clear all
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LOADING */}

            {loading ? (
              <motion.div
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0 }
                }
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5"
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </motion.div>
            ) : products.length > 0 ? (
              /* PRODUCT GRID */

              <motion.div
                key={`${selectedCategory}-${minPrice}-${maxPrice}-${sort}-${searchParams.get("search") || ""}`}
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, y: 12 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product._id || product.id}
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, y: 15 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: shouldReduceMotion
                        ? 0
                        : Math.min(index * 0.045, 0.3),
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* EMPTY STATE */

              <motion.div
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, y: 15, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="flex min-h-105 flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white px-6 text-center"
              >
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { y: [0, -5, 0] }
                  }
                  transition={{
                    duration: 2.2,
                    repeat: shouldReduceMotion ? 0 : Infinity,
                    ease: "easeInOut",
                  }}
                  className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#edf6f0] text-[#17633a]"
                >
                  <FaBoxOpen className="text-3xl" />
                </motion.div>

                <h2 className="text-xl font-extrabold text-gray-900">
                  No products found
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  We couldn't find any products matching your
                  current filters. Try another category or clear
                  your filters.
                </p>

                <motion.button
                  type="button"
                  onClick={clearFilters}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : { scale: 1.03 }
                  }
                  whileTap={
                    shouldReduceMotion
                      ? undefined
                      : { scale: 0.97 }
                  }
                  className="mt-6 rounded-xl bg-[#17633a] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#12532f]"
                >
                  View All Products
                </motion.button>
              </motion.div>
            )}
          </motion.section>
        </div>
      </main>

      {/* MOBILE FILTER DRAWER */}

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            key="mobile-filter-drawer"
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-100 lg:hidden"
          >
            {/* OVERLAY */}

            <motion.button
              type="button"
              aria-label="Close filter menu"
              onClick={() => setMobileFiltersOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            />

            {/* MOBILE BOTTOM SHEET */}

            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-hidden rounded-t-[28px] bg-white shadow-2xl"
            >
              {/* TOP HANDLE */}

              <div className="flex justify-center pt-3">
                <div className="h-1.5 w-12 rounded-full bg-gray-200" />
              </div>

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf6f0] text-[#17633a]">
                      <FaSlidersH className="text-sm" />
                    </div>

                    <h2 className="text-lg font-extrabold text-gray-900">
                      Filters
                    </h2>

                    <AnimatePresence>
                      {activeFilters > 0 && (
                        <motion.span
                          initial={
                            shouldReduceMotion
                              ? false
                              : { scale: 0 }
                          }
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#17633a] px-1.5 text-[10px] font-bold text-white"
                        >
                          {activeFilters}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <p className="mt-1 pl-11 text-xs text-gray-400">
                    Refine products to find what you need
                  </p>
                </div>

                <motion.button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : { rotate: 90 }
                  }
                  whileTap={
                    shouldReduceMotion
                      ? undefined
                      : { scale: 0.9 }
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
                >
                  <FaTimes />
                </motion.button>
              </div>

              {/* SCROLLABLE CONTENT */}

              <div className="max-h-[calc(88vh-145px)] overflow-y-auto px-5 py-5">
                <FilterContent mobile />
              </div>

              {/* BOTTOM ACTION */}

              <div className="border-t border-gray-100 bg-white p-4">
                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    onClick={clearFilters}
                    whileTap={
                      shouldReduceMotion
                        ? undefined
                        : { scale: 0.98 }
                    }
                    className="flex-1 rounded-xl border border-gray-200 py-3.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
                  >
                    Reset
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => setMobileFiltersOpen(false)}
                    whileTap={
                      shouldReduceMotion
                        ? undefined
                        : { scale: 0.98 }
                    }
                    className="flex-2 rounded-xl bg-[#17633a] py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#12532f]"
                  >
                    Show {products.length} Products
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// =========================================================
// PRODUCT SKELETON
// =========================================================

const ProductSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      {/* IMAGE */}

      <div className="aspect-square animate-pulse bg-gray-100" />

      {/* CONTENT */}

      <div className="space-y-3 p-3">
        <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />

        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />

        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />

        <div className="flex items-center justify-between pt-1">
          <div className="h-6 w-20 animate-pulse rounded bg-gray-100" />

          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-100" />
        </div>
      </div>
    </div>
  );
};

export default Products;
