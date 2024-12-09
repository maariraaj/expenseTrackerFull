const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const ForgotPasswordRequest = require("./forgotPasswordRequest");
const DownloadHistory = require("./downloadHistory");

const User = sequelize.define("User", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isPremiumUser: Sequelize.BOOLEAN,
    totalExpense: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
});

User.hasMany(ForgotPasswordRequest, { foreignKey: 'userId', });
ForgotPasswordRequest.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(DownloadHistory, { foreignKey: "userId", onDelete: "CASCADE" });
DownloadHistory.belongsTo(User, { foreignKey: "userId" });

module.exports = User;