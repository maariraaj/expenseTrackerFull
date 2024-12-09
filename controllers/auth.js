const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const Brevo = require("sib-api-v3-sdk");
const ForgotPasswordRequest = require('../models/forgotPasswordRequest');
require('dotenv').config();

exports.postSignUp = async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, name }, process.env.JWT_KEY);
}
exports.postLogIn = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "User not authorized" });
        }
        return res.status(200).json({ message: "User login successful", user: { id: user.id, name: user.name, token: generateAccessToken(user.id, user.name) } });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.postForgotPassword = async (req, res) => {
    const { email } = req.body;
    const defaultClient = Brevo.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const resetRequest = await ForgotPasswordRequest.create({
            userId: user.id,
            isActive: true,
        });
        const resetUrl = `http://localhost:5000/user/resetPassword/${resetRequest.id}`;
        const tranEmailApi = new Brevo.TransactionalEmailsApi();
        const sendSmtpEmail = {
            to: [{ email }],
            sender: { email: "maariraajb@gmail.com", name: "Expense Tracker" },
            subject: "Reset Password Request",
            htmlContent: `<p>Hello,</p><p>Click the following link to reset your password:</p><a href="${resetUrl}">Reset Password</a>`,
        };
        await tranEmailApi.sendTransacEmail(sendSmtpEmail);
        res.status(200).json({ success: true, message: "Reset email sent successfully!" });
    } catch (error) {
        console.error("Error sending reset email:", error);
        res.status(500).json({ success: false, message: "Failed to send reset email" });
    }
};

exports.getResetPassword = async (req, res) => {
    const { id } = req.params;
    try {
        const request = await ForgotPasswordRequest.findOne({ where: { id, isActive: true } });
        if (!request) {
            return res.status(404).send("<h1>Invalid or Expired Link</h1>");
        }
        res.sendFile("resetPassword.html", { root: "./views/auth" });
    } catch (error) {
        console.error("Error fetching reset password request:", error);
        res.status(500).send("An error occurred.");
    }
};

exports.postUpdatePassword = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    try {
        const resetRequest = await ForgotPasswordRequest.findOne({
            where: { id, isActive: true },
        });
        if (!resetRequest) {
            return res.status(404).json({ error: "Invalid or expired reset link" });
        }
        const user = await User.findByPk(resetRequest.userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        resetRequest.isActive = false;
        await resetRequest.save();
        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Failed to update password" });
    }
};