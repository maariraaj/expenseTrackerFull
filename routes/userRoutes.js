const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth');

router.post("/signUp", authController.postSignUp);

router.post("/logIn", authController.postLogIn);

router.post("/forgotPassword", authController.postForgotPassword);

router.get('/resetPassword/:id', authController.getResetPassword);

router.post('/updatePassword/:id', authController.postUpdatePassword);

module.exports = router;