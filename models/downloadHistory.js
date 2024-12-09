const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const DownloadHistory = sequelize.define("DownloadHistory", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    fileURL: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = DownloadHistory;