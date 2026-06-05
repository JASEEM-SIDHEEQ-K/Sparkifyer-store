import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// ─── Get Dashboard Stats ──────────────────────────────────────
// GET /api/admin/stats
export const getDashboardStats = async (req, res) => {
  try {

    // fetch all data in parallel
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      orders,
      recentOrders,
      products,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.find(),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5),
      Product.find(),
    ]);

    // total revenue (exclude cancelled)
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.total || 0), 0);

    // orders by status
    const ordersByStatus = {
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };

    // top products by order frequency
    const productOrderCount = {};
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const id = item.productId?.toString();
        if (id) {
          productOrderCount[id] =
            (productOrderCount[id] || 0) + item.quantity;
        }
      });
    });

    const topProducts = products
      .map((p) => ({
        ...p.toObject(),
        totalSold: productOrderCount[p._id.toString()] || 0,
      }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
      },
      ordersByStatus,
      recentOrders,
      topProducts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch stats!",
    });
  }
};

// ─── Get All Orders (Admin) ───────────────────────────────────
// GET /api/admin/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
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

// ─── Update Order Status (Admin) ──────────────────────────────
// PATCH /api/admin/orders/:id
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status!",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    // restore stock if cancelled
    if (status === "cancelled") {
      await Promise.all(
        order.items.map(async (item) => {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: item.quantity },
          });
        })
      );
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}!`,
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status!",
    });
  }
};

// ─── Get All Users (Admin) ────────────────────────────────────
// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: users.length,
      users,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users!",
    });
  }
};

// ─── Toggle User Status (Admin) ───────────────────────────────
// PATCH /api/admin/users/:id
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // prevent deactivating admin
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot deactivate admin account!",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully!`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle user status!",
    });
  }
};