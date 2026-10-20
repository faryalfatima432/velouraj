import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiEdit,
  FiPackage,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

import API from "../../services/api";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(
          `/products/${id}`
        );

        setProduct(response.data.product);
      } catch (error) {
        console.error("FETCH PRODUCT ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading product...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600"
        >
          <FiArrowLeft />
          Back to Products
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error || "Product not found."}
        </div>
      </div>
    );
  }

  const images = product.images || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/products"
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
          >
            <FiArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Product Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View product information
            </p>
          </div>
        </div>

        <Link
          to={`/admin/products/edit/${product._id}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <FiEdit size={17} />
          Edit Product
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Images */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
            {images[selectedImage] ? (
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                No image
              </div>
            )}
          </div>

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() =>
                    setSelectedImage(index)
                  }
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === index
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Information */}
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-5">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                {product.category}
              </span>

              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                {product.name}
              </h2>

              {product.brand && (
                <p className="mt-2 text-sm text-slate-500">
                  Brand: {product.brand}
                </p>
              )}
            </div>

            <div className="border-t border-slate-100 pt-5">
              <p className="text-sm leading-7 text-slate-600">
                {product.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Price
              </p>

              <p className="mt-2 text-xl font-bold text-slate-900">
                Rs. {product.price.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Sale Price
              </p>

              <p className="mt-2 text-xl font-bold text-blue-600">
                {product.salePrice
                  ? `Rs. ${product.salePrice.toLocaleString()}`
                  : "No sale"}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Stock
              </p>

              <p className="mt-2 flex items-center gap-2 text-xl font-bold text-slate-900">
                <FiPackage size={20} />
                {product.stock}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;