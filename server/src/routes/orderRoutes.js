import express from "express";
import {
  placeOrder,
  getUserOrders,
  getOrderById,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// all order routes require login
router.use(protect);

router.post("/", placeOrder);
router.get("/", getUserOrders);
router.get("/:id", getOrderById);

export default router;