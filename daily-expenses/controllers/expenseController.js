const Expense = require('../models/Expense');
const User = require('../models/User');
const ExcelJS = require('exceljs');

exports.addExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, splitType, participants } = req.body;

    // Check if the paidBy user exists
    const paidByUser = await User.findOne({ email: paidBy });
    if (!paidByUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find participants
    const participantEmails = participants.map(p => p.email);
    const participantsData = await User.find({ email: { $in: participantEmails } });

    // Map participants to email and user ID
    const participantsMap = participantsData.reduce((acc, user) => {
      acc[user.email] = user._id;
      return acc;
    }, {});

    // Verify that all provided participants exist
    for (let participant of participants) {
      if (!participantsMap[participant.email]) {
        return res.status(404).json({ error: `Participant with email ${participant.email} not found` });
      }
    }

    let totalPercentage = 0;

    if (splitType === 'equal') {
      // Equal split
      const splitAmount = amount / participants.length;
      participants.forEach(p => p.amount = splitAmount);
    } else if (splitType === 'exact') {
      // Exact split
      const totalExact = participants.reduce((acc, p) => acc + p.amount, 0);
      if (totalExact !== amount) {
        return res.status(400).json({ error: 'Total exact amounts do not match the total expense amount' });
      }
    } else if (splitType === 'percentage') {
      // Percentage split
      participants.forEach(p => {
        totalPercentage += p.percentage;
        p.amount = (amount * p.percentage) / 100;
      });
      if (totalPercentage !== 100) {
        return res.status(400).json({ error: 'Percentages must add up to 100%' });
      }
    }

    // Create new expense
    const expense = new Expense({
      description,
      amount,
      paidBy: paidByUser._id,
      participants: participants.map(p => ({
        email: p.email,
        amount: p.amount
      }))
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserExpenses = async (req, res) => {
  try {
    const user = await User.findById(req.user.uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const expenses = await Expense.find({ 'participants.email': user.email });
    res.json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.downloadBalanceSheet = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Balance Sheet');

    sheet.columns = [
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Amount', key: 'amount', width: 10 },
      { header: 'Paid By', key: 'paidBy', width: 20 },
      { header: 'Participants', key: 'participants', width: 50 }
    ];

    expenses.forEach(expense => {
      const participants = expense.participants.map(p => `${p.email} (${p.amount})`).join(', ');
      sheet.addRow({
        description: expense.description,
        amount: expense.amount,
        paidBy: expense.paidBy, // Assuming you want to show user IDs
        participants: participants
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=balance-sheet.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
