import express from "express";
import {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// all wishlist routes require login
router.use(protect);

router.get("/", getWishlist);
router.post("/toggle", toggleWishlist);
router.delete("/clear", clearWishlist);
router.delete("/:itemId", removeFromWishlist);

export default router;