const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  photo: String, // base64 or image URL
});

module.exports = mongoose.model('Customer', customerSchema);
