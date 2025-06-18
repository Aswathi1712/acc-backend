// models/Invoice.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
  price: Number,
  total: Number,
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  items: [itemSchema],
  totalAmount: Number,
  amountPaid: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'paid', 'partial'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
