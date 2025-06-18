const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  photo: String, // image URL or base64 string
  role: String,
  password: String,
});

module.exports = mongoose.model('User', userSchema);
