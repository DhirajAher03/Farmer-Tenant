const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  garmentType: { type: String, required: true },
  status: { type: String, required: true, default: 'Active' },
  orderDate: { type: Date, required: true },
  dueDate: { type: Date },
  notes: { type: String },
  measurements: {
    shirt: [{
      field: String,
      value: String
    }],
    pant: [{
      field: String,
      value: String
    }]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
