const mongoose = require('mongoose');

const SalesReturnSchema = new mongoose.Schema({
  returnNumber: String,
  customer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Customer',
  required: true,
},
  date: Date,
  items: [
    {
      description: String,
      quantity: Number,
      price: Number,
      total: Number
    }
  ],
  totalAmount: Number
});

module.exports = mongoose.model('SalesReturn', SalesReturnSchema);
