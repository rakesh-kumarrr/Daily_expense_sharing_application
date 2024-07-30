const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{
    email: { type: String, required: true },
    amount: { type: Number, required: true }
  }]
});

// Define indexes
expenseSchema.index({ description: 1 }); // Example: Creating an index on the description field

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
