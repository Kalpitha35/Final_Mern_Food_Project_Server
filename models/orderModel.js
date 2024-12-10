const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: "foods", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },

    name: { type: String, required: true },
    email: { type: String, required: true },
    shippingAddress: { type: String, required: true },
  
  paymentMethod: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Status can be Pending, Completed, Cancelled
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
