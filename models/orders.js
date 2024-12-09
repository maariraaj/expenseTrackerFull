const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    paymentId: Sequelize.STRING,
    orderId: Sequelize.STRING,
    status: Sequelize.STRING
});

User.hasMany(Order);
Order.belongsTo(User);

module.exports = Order;