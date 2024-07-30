const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true } // Added field
});

// Define indexes
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
