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
      style: { type: String, enum: ['Apple Cut', 'Manella', 'Short Shirt'] },
      height: { type: String },
      chest: { type: String },
      stomach: { type: String },
      sheet: { type: String },
      sleeves: { type: String },
      shoulders: { type: String },
      collar: { type: String },
      front: { type: String }
    },
    pant: {
      style: { type: String, enum: ['Pleated', 'Flat Front', 'Apple Cut'] },
      height: { type: String },
      waist: { type: String },
      sheet: { type: String },
      thigh: { type: String },
      knee: { type: String },
      bottom: { type: String },
      long: { type: String }
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
