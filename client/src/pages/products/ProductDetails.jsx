import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaStar,
  FaCheck,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaBoxOpen,
  FaShareAlt,
} from "react-icons/fa";

import API from "../../services/api";
import { useCart } from "../../context/CartContext";

/*
|--------------------------------------------------------------------------
| Product Details Page
|--------------------------------------------------------------------------
| Route:
| /products/:id
|
| Example:
| /products/65f123456789
|--------------------------------------------------------------------------
*/

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [isWishlisted, setIsWishlisted] = useState(false);

  const [activeTab, setActiveTab] = useState("description");

  const pageVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut", staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  /* =========================================================
     GET PRODUCT
  ========================================================== */

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await API.get(`/products/${id}`);

      const productData =
        response.data?.product ||
        response.data?.data ||
        response.data;

      setProduct(productData);

      if (productData?.category) {
        fetchRelatedProducts(productData.category);
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     RELATED PRODUCTS
  ========================================================== */

  const fetchRelatedProducts = async (category) => {
    try {
      setRelatedLoading(true);

      const response = await API.get("/products", {
        params: {
          category,
        },
      });

      const data =
        response.data?.products ||
        response.data?.data ||
        response.data ||
        [];

      const filteredProducts = Array.isArray(data)
        ? data.filter((item) => item._id !== id).slice(0, 5)
        : [];

      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error(
        "Failed to fetch related products:",
        error
      );

      setRelatedProducts([]);
    } finally {
      setRelatedLoading(false);
    }
  };

  /* =========================================================
     WISHLIST
  ========================================================== */

  useEffect(() => {
    if (!product?._id) return;

    const wishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    const exists = wishlist.some(
      (item) => item._id === product._id
    );

    setIsWishlisted(exists);
  }, [product]);

  const handleWishlist = () => {
    if (!product) return;

    let wishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    const exists = wishlist.some(
      (item) => item._id === product._id
    );

    if (exists) {
      wishlist = wishlist.filter(
        (item) => item._id !== product._id
      );

      setIsWishlisted(false);
    } else {
      wishlist.push(product);

      setIsWishlisted(true);
    }

    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    );

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  };

  /* =========================================================
     QUANTITY
  ========================================================== */

  const increaseQuantity = () => {
    if (!product) return;

    if (quantity < product.stock) {
      setQuantity((previous) => previous + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((previous) => previous - 1);
    }
  };

  /* =========================================================
     ADD TO CART
  ========================================================== */

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  /* =========================================================
     BUY NOW
  ========================================================== */

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    navigate("/checkout");
  };

  /* =========================================================
     SHARE
  ========================================================== */

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );

        alert("Product link copied!");
      }
    } catch (error) {
      console.log("Share cancelled");
    }
  };

  /* =========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  /* =========================================================
     PRODUCT NOT FOUND
  ========================================================== */

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8faf9] px-4 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#edf6f0] text-[#17633a]">
            <FaBoxOpen className="text-3xl" />
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900">
            Product Not Found
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            The product you're looking for may have been
            removed or is no longer available.
          </p>

          <Link
            to="/products"
            className="mt-6 rounded-xl bg-[#17633a] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#12532f]"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  /* =========================================================
     PRODUCT DATA
  ========================================================== */

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [
          "https://via.placeholder.com/700x700?text=No+Image",
        ];

  const originalPrice = Number(product.price) || 0;

  const salePrice =
    Number(product.salePrice) > 0
      ? Number(product.salePrice)
      : originalPrice;

  const discountPercentage =
    Number(product.discountPercentage) > 0
      ? Number(product.discountPercentage)
      : originalPrice > salePrice
      ? Math.round(
          ((originalPrice - salePrice) / originalPrice) *
            100
        )
      : 0;

  /*
   * Fixed rating according to your ShopHub design.
   */
  const rating = 4.6;

  const isInStock = Number(product.stock) > 0;

  const saveAmount = Math.max(
    originalPrice - salePrice,
    0
  );

  return (
    <motion.div
      className="min-h-screen bg-[#f8faf9]"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* =====================================================
          BREADCRUMB
      ====================================================== */}

      <motion.div
        className="border-b border-gray-100 bg-white"
        variants={itemVariants}
      >
        <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 overflow-hidden text-sm">
            <Link
              to="/"
              className="shrink-0 font-medium text-gray-500 transition hover:text-[#17633a]"
            >
              Home
            </Link>

            <FaChevronRight className="shrink-0 text-[8px] text-gray-300" />

            <Link
              to="/products"
              className="shrink-0 font-medium text-gray-500 transition hover:text-[#17633a]"
            >
              Products
            </Link>

            <FaChevronRight className="shrink-0 text-[8px] text-gray-300" />

            <span className="truncate font-semibold text-[#17633a]">
              {product.name}
            </span>
          </nav>
        </div>
      </motion.div>

      {/* =====================================================
          MAIN PRODUCT
      ====================================================== */}

      <motion.main
        className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
        variants={itemVariants}
      >
        {/* Back link */}

        <Link
          to="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#17633a]"
        >
          <FaArrowLeft className="text-xs" />
          Back to Products
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] xl:gap-12">
          {/* =================================================
              LEFT - IMAGE GALLERY
          ================================================== */}

          <motion.section
            className="min-w-0"
            variants={itemVariants}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid gap-4 sm:grid-cols-[90px_1fr]">
              {/* Thumbnails */}

              <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col">
                {images.map((image, index) => (
                  <motion.button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition sm:h-19.5 sm:w-19.5 ${
                      selectedImage === index
                        ? "border-[#17633a] shadow-sm"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-contain p-1"
                    />

                    {selectedImage === index && (
                      <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#17633a] text-white">
                        <FaCheck className="text-[7px]" />
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Main image */}

              <div className="order-1 min-w-0 sm:order-2">
                <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white">
                  {/* Sale */}

                  {discountPercentage > 0 && (
                    <div className="absolute left-4 top-4 z-10 rounded-lg bg-[#17633a] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white shadow-sm">
                      Sale
                    </div>
                  )}

                  {/* Wishlist */}

                  <motion.button
                    type="button"
                    onClick={handleWishlist}
                    aria-label="Add to wishlist"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gray-100 bg-white/95 text-gray-500 shadow-sm backdrop-blur transition hover:text-red-500"
                  >
                    {isWishlisted ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </motion.button>

                  {/* Image */}

                  <div className="flex aspect-square items-center justify-center p-5 sm:p-8 lg:p-10">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={images[selectedImage]}
                        src={images[selectedImage]}
                        alt={product.name}
                        className="h-full w-full object-contain"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                      />
                    </AnimatePresence>
                  </div>
                </div>

                {/* Image count */}

                <div className="mt-3 flex items-center justify-between px-1">
                  <span className="text-xs text-gray-400">
                    {selectedImage + 1} / {images.length}
                  </span>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-500 transition hover:text-[#17633a]"
                  >
                    <FaShareAlt className="text-[10px]" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* =================================================
              RIGHT - PRODUCT INFO
          ================================================== */}

          <motion.section
            className="min-w-0"
            variants={itemVariants}
          >
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
              {/* Category */}

              {product.category && (
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#17633a]">
                  {product.category}
                </p>
              )}

              {/* Product name */}

              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-[34px]">
                {product.name}
              </h1>

              {/* Rating */}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 rounded-lg bg-[#fff8e7] px-2.5 py-1.5">
                  <FaStar className="text-sm text-yellow-500" />

                  <span className="text-sm font-bold text-gray-800">
                    {rating.toFixed(1)}
                  </span>
                </div>

                <span className="text-sm text-gray-400">
                  Customer Rating
                </span>

                {product.brand && (
                  <>
                    <span className="h-4 w-px bg-gray-200" />

                    <span className="text-sm font-medium text-gray-500">
                      Brand:{" "}
                      <span className="font-bold text-gray-700">
                        {product.brand}
                      </span>
                    </span>
                  </>
                )}
              </div>

              {/* Divider */}

              <div className="my-6 h-px bg-gray-100" />

              {/* Price */}

              <div>
                <div className="flex flex-wrap items-end gap-3">
                  <span className="text-3xl font-extrabold tracking-tight text-[#17633a] sm:text-4xl">
                    Rs. {salePrice.toLocaleString()}
                  </span>

                  {salePrice < originalPrice && (
                    <span className="mb-1 text-base text-gray-400 line-through">
                      Rs. {originalPrice.toLocaleString()}
                    </span>
                  )}

                  {discountPercentage > 0 && (
                    <span className="mb-1 rounded-md bg-[#edf6f0] px-2 py-1 text-xs font-extrabold text-[#17633a]">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>

                {saveAmount > 0 && (
                  <p className="mt-2 text-sm font-medium text-gray-500">
                    You save{" "}
                    <span className="font-bold text-[#17633a]">
                      Rs. {saveAmount.toLocaleString()}
                    </span>
                  </p>
                )}
              </div>

              {/* Description */}

              {/* {product.description && (
                <div className="mt-6">
                  <h2 className="mb-2 text-sm font-bold text-gray-900">
                    About this product
                  </h2>

                  <p className="text-sm leading-7 text-gray-500">
                    {product.description}
                  </p>
                </div>
              )} */}

              {/* Stock */}

              <div className="mt-6">
                {isInStock ? (
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#17633a]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#edf6f0]">
                      <FaCheck className="text-[10px]" />
                    </span>

                    In Stock

                    <span className="font-normal text-gray-400">
                      ({product.stock} available)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm font-semibold text-red-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    Out of Stock
                  </div>
                )}
              </div>

              {/* =================================================
                  QUANTITY
              ================================================== */}

              {isInStock && (
                <div className="mt-7">
                  <p className="mb-3 text-sm font-bold text-gray-900">
                    Quantity
                  </p>

                  <div className="flex items-center justify-between rounded-xl border border-gray-200 p-1.5 sm:w-fit">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FaMinus className="text-xs" />
                    </button>

                    <span className="flex min-w-13.75 justify-center text-sm font-extrabold text-gray-900">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  ACTION BUTTONS
              ================================================== */}

              <div className="mt-7 space-y-3">
                <div className="flex gap-3">
                  {/* Add to cart */}

                  <motion.button
                    type="button"
                    disabled={!isInStock}
                    onClick={handleAddToCart}
                    whileHover={isInStock ? { y: -2, scale: 1.01 } : undefined}
                    whileTap={isInStock ? { scale: 0.98 } : undefined}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#17633a] bg-white px-4 py-3.5 text-sm font-extrabold text-[#17633a] transition hover:bg-[#edf6f0] disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
                  >
                    <FaShoppingBag className="text-sm" />

                    Add to Cart
                  </motion.button>

                  {/* Wishlist */}
{/* 
                  <button
                    type="button"
                    onClick={handleWishlist}
                    className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border-2 transition ${
                      isWishlisted
                        ? "border-red-200 bg-red-50 text-red-500"
                        : "border-gray-200 bg-white text-gray-500 hover:border-red-200 hover:text-red-500"
                    }`}
                  >
                    {isWishlisted ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button> */}
                </div>

                {/* Buy now */}

                <motion.button
                  type="button"
                  disabled={!isInStock}
                  onClick={handleBuyNow}
                  whileHover={isInStock ? { y: -2 } : undefined}
                  whileTap={isInStock ? { scale: 0.985 } : undefined}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#17633a] px-4 py-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#12532f] disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  
                  Buy Now
                  <FaArrowLeft className="rotate-180 text-xs" />
                </motion.button>
              </div>

              {/* =================================================
                  SERVICE BENEFITS
              ================================================== */}

              <div className="mt-7 grid grid-cols-1 gap-3 border-t border-gray-100 pt-6 sm:grid-cols-3">
                {/* Delivery */}

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#edf6f0] text-[#17633a]">
                    <FaTruck className="text-sm" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      Fast Delivery
                    </p>

                    <p className="mt-0.5 text-[10px] text-gray-400">
                      Across Pakistan
                    </p>
                  </div>
                </div>

                {/* Returns */}

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#edf6f0] text-[#17633a]">
                    <FaUndo className="text-sm" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      Easy Returns
                    </p>

                    <p className="mt-0.5 text-[10px] text-gray-400">
                      Simple return policy
                    </p>
                  </div>
                </div>

                {/* Secure */}

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#edf6f0] text-[#17633a]">
                    <FaShieldAlt className="text-sm" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      Secure Shopping
                    </p>

                    <p className="mt-0.5 text-[10px] text-gray-400">
                      Safe & reliable
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* =====================================================
            PRODUCT INFORMATION TABS
        ====================================================== */}

        <motion.section
          className="mt-10 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
          variants={itemVariants}
        >
          {/* Tabs */}

          <div className="border-b border-gray-100">
            <div className="flex overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("description")}
                className={`relative whitespace-nowrap px-5 py-4 text-sm font-bold transition sm:px-7 ${
                  activeTab === "description"
                    ? "text-[#17633a]"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Description

                {activeTab === "description" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#17633a]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("information")}
                className={`relative whitespace-nowrap px-5 py-4 text-sm font-bold transition sm:px-7 ${
                  activeTab === "information"
                    ? "text-[#17633a]"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Product Information

                {activeTab === "information" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#17633a]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("shipping")}
                className={`relative whitespace-nowrap px-5 py-4 text-sm font-bold transition sm:px-7 ${
                  activeTab === "shipping"
                    ? "text-[#17633a]"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Delivery & Returns

                {activeTab === "shipping" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#17633a]" />
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}

          <div className="p-5 sm:p-7 lg:p-9">
            {/* DESCRIPTION */}

            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div
                  key="description"
                  className="max-w-4xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                >
                <h2 className="mb-4 text-lg font-extrabold text-gray-900">
                  Product Description
                </h2>

                <p className="whitespace-pre-line text-sm leading-8 text-gray-500">
                  {product.description ||
                    "No detailed description is available for this product."}
                </p>
                </motion.div>
              )}

              {/* INFORMATION */}

              {activeTab === "information" && (
                <motion.div
                  key="information"
                  className="max-w-3xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                >
                <h2 className="mb-5 text-lg font-extrabold text-gray-900">
                  Product Information
                </h2>

                <div className="overflow-hidden rounded-xl border border-gray-100">
                  <InfoRow
                    label="Product"
                    value={product.name}
                  />

                  <InfoRow
                    label="Category"
                    value={product.category || "N/A"}
                  />

                  <InfoRow
                    label="Brand"
                    value={product.brand || "ShopHub"}
                  />

                  <InfoRow
                    label="Availability"
                    value={
                      isInStock
                        ? `${product.stock} items in stock`
                        : "Out of stock"
                    }
                  />

                  <InfoRow
                    label="Rating"
                    value={`${rating.toFixed(1)} / 5`}
                  />
                </div>
                </motion.div>
              )}

              {/* SHIPPING */}

              {activeTab === "shipping" && (
                <motion.div
                  key="shipping"
                  className="grid gap-5 sm:grid-cols-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                >
                <InfoBox
                  icon={<FaTruck />}
                  title="Delivery"
                  text="Fast and reliable delivery across Pakistan."
                />

                <InfoBox
                  icon={<FaUndo />}
                  title="Returns"
                  text="Contact our support team for eligible returns."
                />

                <InfoBox
                  icon={<FaShieldAlt />}
                  title="Secure Shopping"
                  text="Your order information is handled securely."
                />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* =====================================================
            RELATED PRODUCTS
        ====================================================== */}

        {(relatedLoading || relatedProducts.length > 0) && (
          <motion.section
            className="mt-12"
            variants={itemVariants}
          >
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#17633a]">
                  You May Also Like
                </p>

                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  Related Products
                </h2>
              </div>

              <Link
                to="/products"
                className="hidden items-center gap-2 text-sm font-bold text-[#17633a] transition hover:text-[#12532f] sm:flex"
              >
                View All
                <FaArrowLeft className="rotate-180 text-[10px]" />
              </Link>
            </div>

            {relatedLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <RelatedSkeleton key={index} />
                ))}
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.07 } },
                }}
              >
                {relatedProducts.map((item) => (
                  <motion.div
                    key={item._id}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                    }}
                  >
                    <RelatedProductCard product={item} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.section>
        )}
      </motion.main>
    </motion.div>
  );
};

/* =========================================================
   INFO ROW
========================================================= */

const InfoRow = ({ label, value }) => {
  return (
    <div className="grid grid-cols-2 border-b border-gray-100 last:border-b-0">
      <div className="bg-gray-50 px-4 py-3.5 text-sm font-semibold text-gray-600">
        {label}
      </div>

      <div className="px-4 py-3.5 text-sm text-gray-700">
        {value}
      </div>
    </div>
  );
};

/* =========================================================
   INFO BOX
========================================================= */

const InfoBox = ({ icon, title, text }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-[#f8faf9] p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf6f0] text-[#17633a]">
        {icon}
      </div>

      <h3 className="text-sm font-extrabold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {text}
      </p>
    </div>
  );
};

/* =========================================================
   RELATED PRODUCT CARD
========================================================= */

const RelatedProductCard = ({ product }) => {
  const image =
    product.images?.[0] ||
    "https://via.placeholder.com/500x500?text=No+Image";

  const originalPrice = Number(product.price) || 0;

  const salePrice =
    Number(product.salePrice) > 0
      ? Number(product.salePrice)
      : originalPrice;

  const discount =
    Number(product.discountPercentage) > 0
      ? Number(product.discountPercentage)
      : originalPrice > salePrice
      ? Math.round(
          ((originalPrice - salePrice) / originalPrice) *
            100
        )
      : 0;

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/products/${product._id}`}
        className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:shadow-lg"
      >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {discount > 0 && (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-[#17633a] px-2 py-1 text-[9px] font-extrabold uppercase text-white">
            Sale
          </span>
        )}

        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-3">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#17633a]">
          {product.category}
        </p>

        <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-gray-800">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-1">
          <FaStar className="text-[10px] text-yellow-500" />

          <span className="text-[11px] font-semibold text-gray-600">
            4.6
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-sm font-extrabold text-[#17633a]">
            Rs. {salePrice.toLocaleString()}
          </span>

          {salePrice < originalPrice && (
            <span className="text-[10px] text-gray-400 line-through">
              Rs. {originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      </Link>
    </motion.div>
  );
};

/* =========================================================
   PAGE SKELETON
========================================================= */

const ProductDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="h-4 w-48 animate-pulse rounded bg-gray-100" />
        </div>
      </div>

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-100" />

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-gray-100" />

          <div className="rounded-3xl border border-gray-100 bg-white p-6">
            <div className="space-y-5">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />

              <div className="h-9 w-4/5 animate-pulse rounded bg-gray-100" />

              <div className="h-6 w-40 animate-pulse rounded bg-gray-100" />

              <div className="h-px bg-gray-100" />

              <div className="h-10 w-48 animate-pulse rounded bg-gray-100" />

              <div className="h-20 w-full animate-pulse rounded bg-gray-100" />

              <div className="h-6 w-32 animate-pulse rounded bg-gray-100" />

              <div className="h-14 w-full animate-pulse rounded bg-gray-100" />

              <div className="h-14 w-full animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const RelatedSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="aspect-square animate-pulse bg-gray-100" />

      <div className="space-y-3 p-3">
        <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />

        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />

        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />

        <div className="h-5 w-20 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
};

export default ProductDetails;