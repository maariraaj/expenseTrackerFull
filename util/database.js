// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// let sequelize;

// if (process.env.NODE_ENV === "production") {
//     sequelize = new Sequelize(
//         process.env.INF_DB_SCHEMA,
//         process.env.INF_DB_USERNAME,
//         process.env.INF_DB_PASSWORD,
//         {
//             host: process.env.INF_DB_HOST,
//             dialect: "mysql",
//             port: 3306,
//             logging: false,
//         }
//     );
// } else {
//     sequelize = new Sequelize(
//         process.env.DB_SCHEMA,
//         process.env.DB_USERNAME,
//         process.env.DB_PASSWORD,
//         {
//             host: process.env.DB_HOST,
//             dialect: process.env.DB_DIALECT || "mysql",
//             logging: true,
//         }
//     );
// }

// module.exports = sequelize;

const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

try {
    if (process.env.NODE_ENV === "production") {
        if (!process.env.INF_DB_HOST) {
            throw new Error("Production DB_HOST is not defined in .env");
        }
        sequelize = new Sequelize(
            process.env.INF_DB_SCHEMA,
            process.env.INF_DB_USERNAME,
            process.env.INF_DB_PASSWORD,
            {
                host: process.env.INF_DB_HOST,
                dialect: "mysql",
                port: process.env.INF_DB_PORT || 3306,
                logging: false,
                dialectOptions: {
                    ssl: {
                        rejectUnauthorized: true, // Optional: Ensure secure connections
                    },
                },
            }
        );
    } else {
        if (!process.env.DB_HOST) {
            throw new Error("Development DB_HOST is not defined in .env");
        }
        sequelize = new Sequelize(
            process.env.DB_SCHEMA,
            process.env.DB_USERNAME,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                dialect: process.env.DB_DIALECT || "mysql",
                port: process.env.DB_PORT || 3306,
                logging: true,
            }
        );
    }

    console.log("Database connection initialized");
} catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
}

module.exports = sequelize;
