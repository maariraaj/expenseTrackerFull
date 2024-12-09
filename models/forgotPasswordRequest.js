const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ForgotPasswordRequest = sequelize.define("ForgotPasswordRequest", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    }
});

module.exports = ForgotPasswordRequest;