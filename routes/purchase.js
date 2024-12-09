const express = require('express');
const userAuthentication = require('../middleware/auth');
const purchaseController = require('../controllers/purchase');

const router = express.Router();

router.get('/premiumMembership', userAuthentication.authenticate, purchaseController.purchasePremium);

router.post('/updateTransactionStatus', userAuthentication.authenticate, purchaseController.updateTransactionStatus);

router.get('/orders', userAuthentication.authenticate, purchaseController.getUserOrders);

module.exports = router;