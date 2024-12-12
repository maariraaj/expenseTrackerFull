const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require('fs');
const sequelize = require("./util/database");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const purchaseRoutes = require("./routes/purchase");
const premiumRoutes = require("./routes/premium");
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("views"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "auth", "logIn.html"));
});

app.use("/user", userRoutes);
app.use("/expenses", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

sequelize
    .authenticate()
    .then(() => {
        console.log("Connected to the database");
        sequelize.sync({ force: false })
            .then(() => {
                console.log("Database synced successfully");
                app.listen(process.env.PORT, () => {
                    console.log(`Server running`);
                });
            });
    })
    .catch((err) => console.error("Database connection failed:", err));