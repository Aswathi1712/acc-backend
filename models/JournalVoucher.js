const mongoose = require('mongoose');

const journalVoucherSchema = new mongoose.Schema({
  voucherNumber: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('JournalVoucher', journalVoucherSchema);
