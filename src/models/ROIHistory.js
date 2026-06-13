const mongoose = require("mongoose");

const roiHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
      required: true,
      index: true,
    },

    roiAmount: {
      type: Number,
      required: true,
    },

    roiDate: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["PROCESSED", "SKIPPED"],
      default: "PROCESSED",
    },
  },
  { timestamps: true }
);

/**
 * IMPORTANT (Idempotency safeguard):
 * Prevent duplicate ROI entries for same user + investment + date
 */
roiHistorySchema.index(
  { user: 1, investment: 1, roiDate: 1 },
  { unique: true }
);

module.exports = mongoose.model("ROIHistory", roiHistorySchema);