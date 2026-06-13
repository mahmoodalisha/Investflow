const mongoose = require("mongoose");

const referralIncomeSchema = new mongoose.Schema(
  {
    receiverUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    generatedByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    level: {
      type: Number,
      required: true,
    },

    incomeAmount: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReferralIncome", referralIncomeSchema);