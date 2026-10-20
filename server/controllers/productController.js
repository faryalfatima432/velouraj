import Product from "../models/Product.js";

/* =========================================
   Helper: Calculate Sale Price
========================================= */

const calculateSalePrice = (price, discountPercentage) => {
  const regularPrice = Number(price);
  const discount = Number(discountPercentage || 0);

  if (!discount || discount <= 0) {
    return null;
  }

  const discountAmount = regularPrice * (discount / 100);

  return Number((regularPrice - discountAmount).toFixed(2));
};

/* =========================================
   GET ALL PRODUCTS
   GET /api/products
========================================= */

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    const filter = {};

    /* Search */

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    /* Category */

    if (category) {
      filter.category = category;
    }

    /* Price Filter */

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    /* Sorting */

    let sortOption = {
      createdAt: -1,
    };

    if (sort === "price-low") {
      sortOption = {
        price: 1,
      };
    }

    if (sort === "price-high") {
      sortOption = {
        price: -1,
      };
    }

    if (sort === "name") {
      sortOption = {
        name: 1,
      };
    }

    if (sort === "stock") {
      sortOption = {
        stock: -1,
      };
    }

    const products = await Product.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

/* =========================================
   GET PRODUCT BY ID
   GET /api/products/:id
========================================= */

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

/* =========================================
   CREATE PRODUCT
   POST /api/products
   Admin Only
========================================= */

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPercentage,
      category,
      brand,
      images,
      stock,
    } = req.body;

    /* Required fields */

    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      !images ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, price, category and at least one image are required",
      });
    }

    /* Convert numbers */

    const regularPrice = Number(price);
    const discount = Number(discountPercentage || 0);
    const productStock = Number(stock || 0);

    /* Validate price */

    if (Number.isNaN(regularPrice) || regularPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number",
      });
    }

    /* Validate discount */

    if (
      Number.isNaN(discount) ||
      discount < 0 ||
      discount > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount percentage must be between 0 and 100",
      });
    }

    /* Validate stock */

    if (Number.isNaN(productStock) || productStock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a valid number",
      });
    }

    /* Calculate sale price */

    const salePrice = calculateSalePrice(
      regularPrice,
      discount
    );

    /* Create product */

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: regularPrice,
      discountPercentage: discount,
      salePrice,
      category: category.trim(),
      brand: brand ? brand.trim() : "",
      images,
      stock: productStock,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

/* =========================================
   UPDATE PRODUCT
   PUT /api/products/:id
   Admin Only
========================================= */

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      description,
      price,
      discountPercentage,
      category,
      brand,
      images,
      stock,
    } = req.body;

    /* Required fields */

    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      !images ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, price, category and at least one image are required",
      });
    }

    /* Convert numbers */

    const regularPrice = Number(price);
    const discount = Number(discountPercentage || 0);
    const productStock = Number(stock || 0);

    /* Validate price */

    if (Number.isNaN(regularPrice) || regularPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number",
      });
    }

    /* Validate discount */

    if (
      Number.isNaN(discount) ||
      discount < 0 ||
      discount > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount percentage must be between 0 and 100",
      });
    }

    /* Validate stock */

    if (Number.isNaN(productStock) || productStock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a valid number",
      });
    }

    /* Calculate sale price */

    const salePrice = calculateSalePrice(
      regularPrice,
      discount
    );

    /* Update */

    product.name = name.trim();
    product.description = description.trim();
    product.price = regularPrice;
    product.discountPercentage = discount;
    product.salePrice = salePrice;
    product.category = category.trim();
    product.brand = brand ? brand.trim() : "";
    product.images = images;
    product.stock = productStock;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

/* =========================================
   DELETE PRODUCT
   DELETE /api/products/:id
   Admin Only
========================================= */

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};