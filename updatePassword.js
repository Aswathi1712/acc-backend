require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');  // adjust path if needed

const MONGO_URI = process.env.MONGO_URI;

async function updatePassword(email, newPassword) {
  await mongoose.connect(MONGO_URI);

  const hashed = await bcrypt.hash(newPassword, 10);

  const user = await User.findOneAndUpdate(
    { email },
    { password: hashed },
    { new: true }
  );

  if (user) {
    console.log(`Password updated for ${email}`);
  } else {
    console.log(`User not found with email: ${email}`);
  }

  await mongoose.disconnect();
}

updatePassword('admin@example.com', 'admin123')
  .catch(console.error);
