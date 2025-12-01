const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["hot", "cold"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
      required: true,
    },
  },
  { timestamps: true }
);

// un seul vote par (user, deal)
voteSchema.index({ userId: 1, dealId: 1 }, { unique: true });

const Vote =
  mongoose.models.Vote || mongoose.model("Vote", voteSchema);

module.exports = Vote;
