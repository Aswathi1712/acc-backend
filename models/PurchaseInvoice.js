const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
  cost: Number,
  total: Number,
});

const appliedPaymentSchema = new mongoose.Schema({
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
});

const purchaseInvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    items: [itemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    appliedPayments: [appliedPaymentSchema],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field: paidAmount
purchaseInvoiceSchema.virtual('paidAmount').get(function () {
  return this.appliedPayments?.reduce((sum, p) => sum + p.amount, 0) || 0;
});

// Virtual field: balance
purchaseInvoiceSchema.virtual('balance').get(function () {
  return this.totalAmount - this.paidAmount;
});

// Virtual field: status
purchaseInvoiceSchema.virtual('status').get(function () {
  if (this.paidAmount === 0) return 'Unpaid';
  if (this.paidAmount >= this.totalAmount) return 'Paid';
  return 'Partial';
});

module.exports = mongoose.model('PurchaseInvoice', purchaseInvoiceSchema);
