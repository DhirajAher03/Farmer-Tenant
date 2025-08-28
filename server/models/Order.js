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
    shirt: {
      style: { type: String, enum: ['Regular', 'Slim Fit', 'Loose'] },
      length: { type: String },
      chest: { type: String },
      waist: { type: String },
      hips: { type: String },
      shoulders: { type: String },
      sleeves: { type: String },
      neck: { type: String },
      arm: { type: String },
      cuff: { type: String },
      notes: { type: String }
    },
    pant: {
      style: { type: String, enum: ['Pleated', 'Flat Front', 'Regular'] },
      length: { type: String },
      waist: { type: String },
      hips: { type: String },
      thigh: { type: String },
      knee: { type: String },
      bottom: { type: String },
      inseam: { type: String },
      outseam: { type: String },
      notes: { type: String }
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
