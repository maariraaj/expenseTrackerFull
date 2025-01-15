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

const sequelize = new Sequelize(
    process.env.DB_SCHEMA,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || "mysql",
        port: process.env.DB_PORT || 3306,
        logging: false, // Disable logging for production
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established successfully.");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
})();

module.exports = sequelize;

