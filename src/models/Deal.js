const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    url: {
      type: String,
    },
    category: {
      type: String,
      enum: ["High-Tech", "Maison", "Mode", "Loisirs", "Autre"],
      default: "Autre",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // un user crée un deal → pending
    },
    temperature: {
      type: Number,
      default: 0, // on calculera ça avec les votes plus tard
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // un deal appartient à un user
    },
  },
  { timestamps: true }
);

const Deal = mongoose.model("Deal", dealSchema);

module.exports = Deal;
