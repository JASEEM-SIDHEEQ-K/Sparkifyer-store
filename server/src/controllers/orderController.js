import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

// ─── Place Order ──────────────────────────────────────────────
// POST /api/orders
export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      subtotal,
      deliveryCharge,
      total,
      paymentMethod,
      shippingAddress,
      isBuyNow,
    } = req.body;

    // validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required!",
      });
    }

    // validate + update stock for each item
    await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);

        if (!product) {
          throw new Error(`Product ${item.name} not found!`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name}!`
          );
        }

        // reduce stock
        product.stock = product.stock - item.quantity;
        await product.save();
      })
    );

    // create order
    const order = await Order.create({
      userId: req.user._id,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal,
      deliveryCharge: deliveryCharge || 0,
      total,
      status: "confirmed",
      paymentMethod,
      shippingAddress,
    });

    // clear cart after order (not for buy now)
    if (!isBuyNow) {
      await Cart.findOneAndUpdate(
        { userId: req.user._id },
        { items: [] }
      );
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to place order!",
    });
  }
};

// ─── Get User Orders ──────────────────────────────────────────
// GET /api/orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: orders.length,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders!",
    });
  }
};

// ─── Get Single Order ─────────────────────────────────────────
// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    // check order belongs to user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order!",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order!",
    });
  }
};