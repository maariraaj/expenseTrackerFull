const express = require('express');
const expensesController = require('../controllers/expenses');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.post('/expense', userAuthentication.authenticate, expensesController.postAddExpense);

router.get('/expenses', userAuthentication.authenticate, expensesController.getExpenses);

router.delete("/:id", userAuthentication.authenticate, expensesController.deleteExpense);

module.exports = router;