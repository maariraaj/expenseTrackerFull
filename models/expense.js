const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User = require('./user');

const Expense = sequelize.define("Expense", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

User.hasMany(Expense);
Expense.belongsTo(User);

module.exports = Expense;