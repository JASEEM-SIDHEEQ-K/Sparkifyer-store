import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStatus,
  getAdminProducts,
} from "../controllers/productController.js";
import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────
router.get("/", getProducts);
router.get("/:id", getProductById);

// ─── Admin Routes ─────────────────────────────────────────────
router.get("/admin/all", protect, adminOnly, getAdminProducts);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.patch(
  "/:id/toggle-status",
  protect,
  adminOnly,
  toggleProductStatus
);

export default router;