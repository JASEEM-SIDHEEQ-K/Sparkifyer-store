import express from "express";
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  toggleUserStatus,
} from "../controllers/adminController.js";
import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// all admin routes require login + admin role
router.use(protect, adminOnly);

// ─── Dashboard ────────────────────────────────────────────────
router.get("/stats", getDashboardStats);

// ─── Orders ───────────────────────────────────────────────────
router.get("/orders", getAllOrders);
router.patch("/orders/:id", updateOrderStatus);

// ─── Users ────────────────────────────────────────────────────
router.get("/users", getAllUsers);
router.patch("/users/:id", toggleUserStatus);

export default router;