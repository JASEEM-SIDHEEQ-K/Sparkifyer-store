import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ─── Get Cart ─────────────────────────────────────────────────
// GET /api/cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    // create empty cart if not exists
    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch cart!",
    });
  }
};

// ─── Add to Cart ──────────────────────────────────────────────
// POST /api/cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // check product exists + active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    // check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available!`,
      });
    }

    // get or create cart
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [],
      });
    }

    // check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      // update quantity
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available!`,
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      // add new item
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        quantity,
        stock: product.stock,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully!",
      cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add to cart!",
    });
  }
};

// ─── Update Cart Item ─────────────────────────────────────────
// PUT /api/cart/:itemId
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // find item in cart
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart!",
      });
    }

    // validate quantity
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1!",
      });
    }

    if (quantity > item.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${item.stock} items available!`,
      });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart item updated!",
      cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update cart!",
    });
  }
};

// ─── Remove Cart Item ─────────────────────────────────────────
// DELETE /api/cart/:itemId
export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // remove item
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== itemId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart!",
      cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to remove cart item!",
    });
  }
};

// ─── Clear Cart ───────────────────────────────────────────────
// DELETE /api/cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully!",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to clear cart!",
    });
  }
};