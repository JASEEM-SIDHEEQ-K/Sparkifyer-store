import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// ─── Get Wishlist ─────────────────────────────────────────────
// GET /api/wishlist
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id });

    // create empty wishlist if not exists
    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: req.user._id,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      wishlist,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch wishlist!",
    });
  }
};

// ─── Toggle Wishlist (Add or Remove) ─────────────────────────
// POST /api/wishlist/toggle
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // check product exists
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    // get or create wishlist
    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: req.user._id,
        items: [],
      });
    }

    // check if already in wishlist
    const existingIndex = wishlist.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    let action;

    if (existingIndex !== -1) {
      // ── Remove from wishlist ──────────────────────────
      wishlist.items.splice(existingIndex, 1);
      action = "removed";
    } else {
      // ── Add to wishlist ───────────────────────────────
      wishlist.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        stock: product.stock,
        category: product.category,
        brand: product.brand,
        rating: product.rating,
      });
      action = "added";
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: `Product ${action} ${action === "added" ? "to" : "from"} wishlist!`,
      action,
      wishlist,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Wishlist action failed!",
    });
  }
};

// ─── Remove from Wishlist ─────────────────────────────────────
// DELETE /api/wishlist/:itemId
export const removeFromWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;

    const wishlist = await Wishlist.findOne({
      userId: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found!",
      });
    }

    // remove item
    wishlist.items = wishlist.items.filter(
      (item) => item._id.toString() !== itemId
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Item removed from wishlist!",
      wishlist,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to remove from wishlist!",
    });
  }
};

// ─── Clear Wishlist ───────────────────────────────────────────
// DELETE /api/wishlist
export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      userId: req.user._id,
    });

    if (wishlist) {
      wishlist.items = [];
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: "Wishlist cleared!",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to clear wishlist!",
    });
  }
};