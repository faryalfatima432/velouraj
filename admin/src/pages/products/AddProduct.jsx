import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaSave,
} from "react-icons/fa";

import API from "../../services/api";

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: "",
    discountPercentage: "0",
    stock: "",
    images: [""],
  });

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  /* =========================================
     Load Categories
  ========================================= */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const response = await API.get("/categories");

        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("CATEGORY ERROR:", error);

        setError("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /* =========================================
     Input Change
  ========================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================
     Image Change
  ========================================= */

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];

    updatedImages[index] = value;

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  /* =========================================
     Add Image Field
  ========================================= */

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  /* =========================================
     Remove Image Field
  ========================================= */

  const removeImageField = (index) => {
    if (formData.images.length === 1) {
      return;
    }

    const updatedImages = formData.images.filter(
      (_, imageIndex) => imageIndex !== index
    );

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  /* =========================================
     Calculate Sale Price
  ========================================= */

  const calculateSalePrice = () => {
    const price = Number(formData.price || 0);

    const discount = Number(
      formData.discountPercentage || 0
    );

    if (!price || discount <= 0) {
      return null;
    }

    return price - price * (discount / 100);
  };

  /* =========================================
     Submit
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    /* Basic validation */

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.category ||
      !formData.stock
    ) {
      setError("Please fill all required fields.");
      return;
    }

    const price = Number(formData.price);

    const discount = Number(
      formData.discountPercentage || 0
    );

    const stock = Number(formData.stock);

    if (price < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (discount < 0 || discount > 100) {
      setError(
        "Discount percentage must be between 0 and 100."
      );
      return;
    }

    if (stock < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    const validImages = formData.images
      .map((image) => image.trim())
      .filter((image) => image !== "");

    if (validImages.length === 0) {
      setError("Please add at least one product image URL.");
      return;
    }

    try {
      setSaving(true);

      const response = await API.post("/products", {
        name: formData.name.trim(),
        description: formData.description.trim(),
        brand: formData.brand.trim(),
        category: formData.category,
        price,
        discountPercentage: discount,
        stock,
        images: validImages,
      });

      if (response.data.success) {
        navigate("/admin/products");
      }
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create product."
      );
    } finally {
      setSaving(false);
    }
  };

  const salePrice = calculateSalePrice();

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <FaArrowLeft />
            Back to Products
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Add Product
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Add a new product to your store.
          </p>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Main Information */}

          <div className="space-y-6 xl:col-span-2">
            {/* Basic Information */}

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-slate-900">
                Basic Information
              </h2>

              <div className="space-y-5">
                {/* Name */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Product Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* Description */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Enter product description"
                    className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* Brand */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Brand
                  </label>

                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Enter brand name"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* Category */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={loadingCategories}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="">
                      {loadingCategories
                        ? "Loading categories..."
                        : "Select category"}
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category._id}
                        value={category.name}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-slate-900">
                Pricing & Stock
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Regular Price */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Regular Price *
                  </label>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      Rs.
                    </span>

                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="5000"
                      className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                {/* Discount */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Discount Percentage
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      name="discountPercentage"
                      value={
                        formData.discountPercentage
                      }
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="1"
                      placeholder="20"
                      className="w-full rounded-lg border border-slate-300 py-3 pl-4 pr-10 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      %
                    </span>
                  </div>
                </div>

                {/* Stock */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Stock *
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    placeholder="100"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Calculated Sale Price */}

              {salePrice !== null && (
                <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Calculated Sale Price
                      </p>

                      <p className="mt-1 text-xs text-green-600">
                        {formData.discountPercentage}% discount
                        applied
                      </p>
                    </div>

                    <p className="text-xl font-bold text-green-700">
                      Rs.{" "}
                      {salePrice.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              )}

              {Number(formData.discountPercentage) ===
                0 &&
                formData.price && (
                  <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm text-blue-700">
                      No discount applied. The sale price will
                      be the regular price.
                    </p>
                  </div>
                )}
            </div>

            {/* Product Images */}

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Product Images
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add one or more image URLs.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addImageField}
                  className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  <FaPlus />
                  Add Image
                </button>
              </div>

              <div className="space-y-3">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="flex gap-2"
                  >
                    <input
                      type="url"
                      value={image}
                      onChange={(e) =>
                        handleImageChange(
                          index,
                          e.target.value
                        )
                      }
                      placeholder={`Image URL ${index + 1}`}
                      className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImageField(index)
                      }
                      disabled={
                        formData.images.length === 1
                      }
                      className="rounded-lg border border-red-200 px-4 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}

          <div className="xl:col-span-1">
            <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-slate-900">
                Product Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Product
                  </span>

                  <span className="text-right font-medium text-slate-900">
                    {formData.name || "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Regular Price
                  </span>

                  <span className="font-medium text-slate-900">
                    {formData.price
                      ? `Rs. ${Number(
                          formData.price
                        ).toLocaleString()}`
                      : "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Discount
                  </span>

                  <span className="font-medium text-slate-900">
                    {formData.discountPercentage || 0}%
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between gap-4">
                    <span className="font-medium text-slate-700">
                      Sale Price
                    </span>

                    <span className="text-lg font-bold text-green-600">
                      {salePrice !== null
                        ? `Rs. ${salePrice.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 2,
                            }
                          )}`
                        : formData.price
                        ? `Rs. ${Number(
                            formData.price
                          ).toLocaleString()}`
                        : "—"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Stock
                  </span>

                  <span className="font-medium text-slate-900">
                    {formData.stock || "0"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Images
                  </span>

                  <span className="font-medium text-slate-900">
                    {
                      formData.images.filter(
                        (image) => image.trim() !== ""
                      ).length
                    }
                  </span>
                </div>
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={saving}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaSave />

                {saving
                  ? "Saving..."
                  : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;