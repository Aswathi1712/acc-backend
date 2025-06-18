const mongoose = require('mongoose');

const appliedInvoiceSchema = new mongoose.Schema({
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PurchaseInvoice',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
});

const paymentSchema = new mongoose.Schema({
  paymentNumber: String,
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
  },
  partyModel: {
    type: String,
    enum: ['Supplier'], // can support 'Customer' later
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  method: {
    type: String,
    enum: ['Cash', 'Bank', 'Cheque'],
    default: 'Cash',
  },
  type: {
    type: String,
    enum: ['incoming', 'outgoing'],
    default: 'outgoing',
  },
  amount: {
    type: Number,
    required: true,
  },notes: {
  type: String,
  default: '',
},
  appliedInvoices: [appliedInvoiceSchema],
});

module.exports = mongoose.model('Payment', paymentSchema);
