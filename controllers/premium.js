//const Expense = require('../models/expense');
//const sequelize = require('../util/database');
const User = require('../models/user');
const DownloadHistory = require("../models/downloadHistory");
const UserServices = require('../services/userServices');
const S3Services = require('../services/S3services');
require('dotenv').config();

// exports.getLeaderboard = async (req, res) => {
//     try {
//         const leaderboard = await Expense.findAll({
//             attributes: [
//                 'userId',
//                 [sequelize.fn('SUM', sequelize.col('amount')), 'totalExpense']
//             ],
//             include: [
//                 {
//                     model: User,
//                     attributes: ['name']
//                 }
//             ],
//             group: ['userId', 'User.id'],
//             order: [['totalExpense', 'DESC']]
//         });

//         res.status(200).json({ success: true, leaderboard });
//     } catch (error) {
//         console.error("Error fetching leaderboard:", error);
//         res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
//     }
// };

exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.findAll({
            attributes: ['id', 'name', 'totalExpense'],
            order: [['totalExpense', 'DESC']]
        });
        res.status(200).json({ success: true, leaderboard });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
    }
};

exports.downloadExpense = async (req, res) => {
    try {
        const expenses = await UserServices.getExpenses(req);
        const stringifiedExpenses = JSON.stringify(expenses);
        const fileName = `Expense${req.user.id}/${new Date()}.txt`;
        const fileURL = await S3Services.uploadToS3(stringifiedExpenses, fileName);
        await DownloadHistory.create({
            userId: req.user.id,
            fileURL,
        });
        res.status(200).json({ fileURL, success: true });
    } catch (error) {
        console.error('Error downloading expenses:', error);
        res.status(500).json({ fileURL: '', success: false, err: error });
    }
};

exports.getDownloadHistory = async (req, res) => {
    try {
        const downloadHistory = await DownloadHistory.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ success: true, downloadHistory });
    } catch (error) {
        console.error("Error fetching download history:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch download history' });
    }
};