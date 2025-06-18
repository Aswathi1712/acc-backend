const mongoose = require('mongoose');

const PDCSchema = new mongoose.Schema({
  chequeNumber: { type: String, required: true },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  party: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  status: { type: String, enum: ['New', 'Deposited', 'Cleared', 'Bounced', 'Cancelled'], default: 'New' },
  bankAccount: { type: String },
  clearanceDate: { type: Date },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('PDC', PDCSchema);
