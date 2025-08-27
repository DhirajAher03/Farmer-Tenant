const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  city: { type: String },
  DOB: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
