import { useEffect, useState } from "react";
import {
  FiEdit,
  FiImage,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import API from "../../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/categories");

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("FETCH CATEGORIES ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await API.delete(`/categories/${id}`);

      setCategories((previous) =>
        previous.filter(
          (category) => category._id !== id
        )
      );
    } catch (error) {
      console.error("DELETE CATEGORY ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete category."
      );
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      const response = await API.put(
        `/categories/${category._id}`,
        {
          ...category,
          isActive: !category.isActive,
        }
      );

      const updatedCategory =
        response.data.category;

      setCategories((previous) =>
        previous.map((item) =>
          item._id === updatedCategory._id
            ? updatedCategory
            : item
        )
      );
    } catch (error) {
      console.error(
        "UPDATE CATEGORY STATUS ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update category status."
      );
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      category.description
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage product categories
          </p>
        </div>

        <Link
          to="/admin/categories/add"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <FiPlus size={18} />
          Add Category
        </Link>
      </div>

      {/* Search */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search categories..."
            className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <p className="text-sm text-slate-500">
              Loading categories...
            </p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
            <div className="mb-3 rounded-full bg-slate-100 p-4">
              <FiSearch
                size={24}
                className="text-slate-400"
              />
            </div>

            <h3 className="font-semibold text-slate-800">
              No categories found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try another search term."
                : "Add your first category."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Description
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Created
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map(
                  (category) => (
                    <tr
                      key={category._id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* Category */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <FiImage
                                  className="text-slate-400"
                                  size={20}
                                />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {category.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              ID: {category._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="max-w-xs px-6 py-4">
                        <p className="truncate text-sm text-slate-600">
                          {category.description ||
                            "No description"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(category)
                          }
                          className="inline-flex items-center gap-2"
                        >
                          {category.isActive ? (
                            <>
                              <FiToggleRight
                                size={25}
                                className="text-green-500"
                              />

                              <span className="text-sm font-medium text-green-600">
                                Active
                              </span>
                            </>
                          ) : (
                            <>
                              <FiToggleLeft
                                size={25}
                                className="text-slate-400"
                              />

                              <span className="text-sm font-medium text-slate-500">
                                Inactive
                              </span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {category.createdAt
                          ? new Date(
                              category.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/categories/edit/${category._id}`}
                            title="Edit category"
                            className="rounded-lg p-2 text-blue-500 transition hover:bg-blue-50 hover:text-blue-700"
                          >
                            <FiEdit size={17} />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                category._id
                              )
                            }
                            title="Delete category"
                            className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                          >
                            <FiTrash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && categories.length > 0 && (
        <p className="text-sm text-slate-500">
          Showing {filteredCategories.length} of{" "}
          {categories.length} categories
        </p>
      )}
    </div>
  );
}

export default Categories;