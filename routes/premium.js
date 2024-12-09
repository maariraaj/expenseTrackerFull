const express = require('express');
const premiumController = require('../controllers/premium');
const router = express.Router();
const userAuthentication = require('../middleware/auth');

router.get('/leaderboard', premiumController.getLeaderboard);

router.get('/download', userAuthentication.authenticate, premiumController.downloadExpense);

router.get('/downloadHistory', userAuthentication.authenticate, premiumController.getDownloadHistory);

module.exports = router;