const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  receiptNumber: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Cash', 'Bank Transfer', 'Cheque'], default: 'Cash' },
  notes: { type: String },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' } // Add reference to payment
});

module.exports = mongoose.model('Receipt', receiptSchema);
