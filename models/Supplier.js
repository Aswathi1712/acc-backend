const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contactPerson: String,
  phone: String,
  email: String,
  address: String,
});

module.exports = mongoose.model('Supplier', supplierSchema);
