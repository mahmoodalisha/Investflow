const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    investmentAmount: {
      type: Number,
      required: true,
    },

    planDetails: {
      type: String,
      default: "Basic Plan",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: true,
    },

    dailyROIPercentage: {
      type: Number,
      required: true,
    },

    investmentStatus: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Investment", investmentSchema);