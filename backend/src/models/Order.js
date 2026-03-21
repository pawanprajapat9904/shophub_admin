const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);