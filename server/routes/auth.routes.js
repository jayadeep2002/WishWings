const express = require('express');
const router = express.Router();
const { registerUser, loginUser, registerAgent, loginAgent, loginAdmin, forgotPassword, verifyOtp, resetPassword } = require('../controllers/auth.controller');

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.post('/agent/register', registerAgent);
router.post('/agent/login', loginAgent);
router.post('/admin/login', loginAdmin);

// Password Reset via OTP
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

module.exports = router;
