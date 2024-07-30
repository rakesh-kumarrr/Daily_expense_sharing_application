const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { expenseSchema } = require('../validators/expenseValidator');
const validationMiddleware = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, validationMiddleware(expenseSchema), expenseController.addExpense);
router.get('/user', authMiddleware, expenseController.getUserExpenses);
router.get('/', authMiddleware, expenseController.getAllExpenses);
router.get('/balance-sheet', authMiddleware, expenseController.downloadBalanceSheet);

module.exports = router;
