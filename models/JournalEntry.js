const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  referenceType: { type: String, enum: ['Invoice', 'Payment', 'Receipt', 'Manual'], required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: Date, required: true },
  account: { type: String, required: true },
  debit: { type: Number, default: 0 },
  credit: { type: Number, default: 0 },
  narration: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
