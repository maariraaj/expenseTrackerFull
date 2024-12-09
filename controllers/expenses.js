const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

exports.postAddExpense = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const user = await User.findByPk(req.user.id, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ error: "User not found" });
        }

        const { amount, description, category } = req.body;
        const newExpense = await Expense.create(
            {
                amount,
                description,
                category,
                UserId: req.user.id
            },
            { transaction }
        );
        user.totalExpense += Number(amount);
        await user.save({ transaction });

        await transaction.commit();
        res.status(201).json(newExpense);
    } catch (error) {
        await transaction.rollback();
        console.error('Error adding expense:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getExpenses = async (req, res) => {
    const { page, limit } = req.query;
    try {
        const offset = (page - 1) * limit;
        const { count, rows: expenses } = await Expense.findAndCountAll({
            where: { userId: req.user.id },
            offset,
            limit: parseInt(limit),
        });
        res.status(200).json({
            totalExpenses: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            limit,
            expenses
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const expense = await Expense.findByPk(id, { transaction });
        if (!expense) {
            await transaction.rollback();
            return res.status(404).json({ error: "Expense not found" });
        }
        const user = await User.findByPk(expense.UserId, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ error: "User not found" });
        }
        user.totalExpense -= expense.amount;
        if (user.totalExpense < 0) user.totalExpense = 0;
        await user.save({ transaction });

        await expense.destroy({ transaction });

        await transaction.commit();
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: "Failed to delete expense" });
    }
};