
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import {
  FaShoppingBag,
  FaStar,
  FaRegHeart,
  FaHeart,
  FaExclamationCircle,
} from "react-icons/fa";

import { useCart } from "../../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const shouldReduceMotion = useReducedMotion();

  const {
    _id,
    name,
    category,
    price,
    salePrice,
    discountPercentage,
    images,
    stock,
  } = product;

  const [isWishlisted, setIsWishlisted] = useState(false);

  // =========================================================
  // WISHLIST STATUS
  // =========================================================

  useEffect(() => {
    try {
      const savedWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      const exists = savedWishlist.some(
        (item) => item._id === _id
      );

      setIsWishlisted(exists);
    } catch (error) {
      console.error("Wishlist status error:", error);
      setIsWishlisted(false);
    }
  }, [_id]);

  // =========================================================
  // WISHLIST
  // =========================================================

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const savedWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      if (isWishlisted) {
        const updatedWishlist = savedWishlist.filter(
          (item) => item._id !== _id
        );

        localStorage.setItem(
          "wishlist",
          JSON.stringify(updatedWishlist)
        );

        setIsWishlisted(false);
      } else {
        const updatedWishlist = [
          ...savedWishlist,
          product,
        ];

        localStorage.setItem(
          "wishlist",
          JSON.stringify(updatedWishlist)
        );

        setIsWishlisted(true);
      }

      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  // =========================================================
  // PRICE
  // =========================================================

  const regularPrice = Number(price || 0);

  const productSalePrice =
    salePrice !== null &&
    salePrice !== undefined &&
    Number(salePrice) > 0
      ? Number(salePrice)
      : 0;

  const hasDiscount =
    productSalePrice > 0 &&
    productSalePrice < regularPrice;

  const currentPrice = hasDiscount
    ? productSalePrice
    : regularPrice;

  const discount = hasDiscount
    ? Math.round(
        ((regularPrice - productSalePrice) /
          regularPrice) *
          100
      )
    : Number(discountPercentage || 0);

  // =========================================================
  // STOCK
  // =========================================================

  const isOutOfStock = !stock || Number(stock) <= 0;

  const isLowStock =
    Number(stock) > 0 && Number(stock) <= 5;

  // =========================================================
  // IMAGE
  // =========================================================

  const productImage =
    images && images.length > 0
      ? images[0]
      : "https://via.placeholder.com/600x600?text=No+Image";

  // =========================================================
  // CATEGORY
  // =========================================================

  const categoryLabel =
    typeof category === "object"
      ? category?.name
      : category || "";

  // =========================================================
  // FIXED RATING
  // =========================================================

  const rating = 4.6;

  // =========================================================
  // ANIMATION SETTINGS
  // =========================================================

  const cardInitial = shouldReduceMotion
    ? false
    : { opacity: 0, y: 20 };

  const cardVisible = shouldReduceMotion
    ? undefined
    : { opacity: 1, y: 0 };

  return (
    <motion.article
      initial={cardInitial}
      whileInView={cardVisible}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
      whileHover={
        shouldReduceMotion ? undefined : { y: -4 }
      }
      className="
        group
        overflow-hidden
        rounded-xl
        border
        border-[#e7e8e2]
        bg-white
        transition-all
        duration-300
        hover:border-[#17633a]
        hover:shadow-lg
      "
    >
      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="relative overflow-hidden bg-[#f5f5f1]">
        <Link to={`/products/${_id}`} className="block">
          <div className="relative aspect-square">
            <motion.img
              src={productImage}
              alt={name}
              loading="lazy"
              whileHover={
                shouldReduceMotion || isOutOfStock
                  ? undefined
                  : { scale: 1.05 }
              }
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              className={`
                h-full
                w-full
                object-cover
                transition
                duration-500
                ${
                  isOutOfStock
                    ? "grayscale opacity-60"
                    : ""
                }
              `}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  "https://via.placeholder.com/600x600?text=No+Image";
              }}
            />

            {/* SALE BADGE */}

            {discount > 0 && !isOutOfStock && (
              <span
                className="
                  absolute
                  left-3
                  top-3
                  rounded-md
                  bg-[#17633a]
                  px-2.5
                  py-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-white
                "
              >
                Sale
              </span>
            )}

            {/* DISCOUNT */}

            {discount > 0 && !isOutOfStock && (
              <span
                className="
                  absolute
                  left-3
                  top-11
                  rounded-md
                  bg-[#e8f3eb]
                  px-2
                  py-1
                  text-[10px]
                  font-bold
                  text-[#17633a]
                "
              >
                -{discount}%
              </span>
            )}
          </div>
        </Link>

        {/* ===================================================
            WISHLIST BUTTON
        =================================================== */}

        <motion.button
          type="button"
          onClick={handleWishlist}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          whileHover={
            shouldReduceMotion ? undefined : { scale: 1.1 }
          }
          whileTap={
            shouldReduceMotion ? undefined : { scale: 0.9 }
          }
          transition={{ duration: 0.2 }}
          className="
            absolute
            right-3
            top-3
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-md
            transition
            hover:scale-110
          "
        >
          {isWishlisted ? (
            <FaHeart className="text-sm text-[#c94b4b]" />
          ) : (
            <FaRegHeart className="text-sm text-[#555c50]" />
          )}
        </motion.button>

        {/* ===================================================
            STOCK
        =================================================== */}

        {isOutOfStock && (
          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              flex
              items-center
              justify-center
              gap-2
              bg-[#a94e40]/95
              px-3
              py-2
              text-[10px]
              font-bold
              uppercase
              tracking-wide
              text-white
            "
          >
            <FaExclamationCircle />
            Out of Stock
          </div>
        )}

        {!isOutOfStock && isLowStock && (
          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              bg-[#fff4dc]
              px-3
              py-1.5
              text-center
              text-[10px]
              font-semibold
              text-[#a36b00]
            "
          >
            Only {stock} left
          </div>
        )}
      </div>

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}

      <div className="p-3 sm:p-4">
        {/* CATEGORY */}

        {categoryLabel && (
          <p
            className="
              mb-1
              text-[9px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-[#85897e]
              sm:text-[10px]
            "
          >
            {categoryLabel}
          </p>
        )}

        {/* PRODUCT NAME */}

        <Link to={`/products/${_id}`}>
          <h2
            className="
              line-clamp-2
              min-h-10
              text-[13px]
              font-semibold
              leading-5
              text-[#252a25]
              transition
              hover:text-[#17633a]
              sm:text-sm
            "
          >
            {name}
          </h2>
        </Link>

        {/* =================================================
            FIXED 4.6 RATING
        ================================================= */}

        <div className="mt-2.5 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <FaStar
                key={index}
                className={`
                  text-[10px]
                  sm:text-xs
                  ${
                    index < Math.round(rating)
                      ? "text-[#f5b301]"
                      : "text-[#dedfd8]"
                  }
                `}
              />
            ))}
          </div>

          <span
            className="
              text-[10px]
              font-medium
              text-[#85897e]
              sm:text-xs
            "
          >
            {rating.toFixed(1)}
          </span>
        </div>

        {/* =================================================
            PRICE
        ================================================= */}

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-base font-bold text-[#17633a] sm:text-lg">
                Rs. {currentPrice.toLocaleString()}
              </span>

              {hasDiscount && (
                <span className="text-[10px] text-[#999d96] line-through sm:text-xs">
                  Rs. {regularPrice.toLocaleString()}
                </span>
              )}
            </div>

            {hasDiscount && (
              <p className="mt-0.5 text-[9px] font-medium text-[#638066] sm:text-[10px]">
                Save Rs.{" "}
                {(regularPrice - currentPrice).toLocaleString()}
              </p>
            )}
          </div>

          {/* ADD TO CART */}

          <motion.button
            type="button"
            disabled={isOutOfStock}
            onClick={() => addToCart(product, 1)}
            aria-label="Add to cart"
            whileHover={
              shouldReduceMotion || isOutOfStock
                ? undefined
                : { scale: 1.08 }
            }
            whileTap={
              shouldReduceMotion || isOutOfStock
                ? undefined
                : { scale: 0.94 }
            }
            transition={{ duration: 0.2 }}
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              transition
              ${
                isOutOfStock
                  ? "cursor-not-allowed bg-[#e9e9e2] text-[#92968c]"
                  : "bg-[#17633a] text-white hover:bg-[#12532f] active:scale-95"
              }
            `}
          >
            <FaShoppingBag className="text-sm" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;
