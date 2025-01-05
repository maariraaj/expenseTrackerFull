const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.NODE_ENV === "production") {
    sequelize = new Sequelize(
        process.env.DB_SCHEMA,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            port: 3306
        }
    );
} else {
    sequelize = new Sequelize(
        process.env.DB_SCHEMA,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT,
        }
    );
}

module.exports = sequelize;