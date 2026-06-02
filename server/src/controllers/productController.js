import Product from "../models/Product.js";

// ─── Get All Products ─────────────────────────────────────────
// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      sort,
      minPrice,
      maxPrice,
      page = 1,
      limit = 100,
    } = req.query;

    // build filter
    const filter = { isActive: true };

    // category filter
    if (category && category !== "All") {
      filter.category = category;
    }

    // price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // build sort
    let sortOption = {};
    switch (sort) {
      case "price-asc":
        sortOption = { price: 1 };
        break;
      case "price-desc":
        sortOption = { price: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "name-asc":
        sortOption = { name: 1 };
        break;
      case "name-desc":
        sortOption = { name: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products!",
    });
  }
};

// ─── Get Single Product ───────────────────────────────────────
// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product!",
    });
  }
};

// ─── Create Product (Admin) ───────────────────────────────────
// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      price,
      originalPrice,
      stock,
      rating,
      reviews,
      description,
      image,
      images,
      tags,
    } = req.body;

    // check duplicate
    const existing = await Product.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Product "${name}" already exists!`,
      });
    }

    const product = await Product.create({
      name,
      category,
      brand,
      price,
      originalPrice,
      stock,
      rating: rating || 0,
      reviews: reviews || 0,
      description,
      image,
      images: images || [image],
      tags: tags || [],
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create product!",
    });
  }
};

// ─── Update Product (Admin) ───────────────────────────────────
// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update product!",
    });
  }
};

// ─── Toggle Product Status (Admin) ───────────────────────────
// PATCH /api/products/:id/toggle-status
export const toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${product.isActive ? "activated" : "deactivated"} successfully!`,
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle product status!",
    });
  }
};

// ─── Get All Products for Admin ───────────────────────────────
// GET /api/products/admin/all
export const getAdminProducts = async (req, res) => {
  try {
    // admin gets ALL products including inactive
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: products.length,
      products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products!",
    });
  }
};