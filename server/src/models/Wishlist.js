import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String },
  stock: { type: Number },
  category: { type: String },
  brand: { type: String },
  rating: { type: Number },
});

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,         // ✅ one wishlist per user
    },
    items: [wishlistItemSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Wishlist", wishlistSchema);