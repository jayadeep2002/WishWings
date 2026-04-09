const express = require('express');
const router = express.Router();
const { uploadMedia, getVaultByBooking, getMyVault } = require('../controllers/reactionVault.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect(['user', 'agent', 'admin']));

router.get('/my-vault', getMyVault);
router.get('/booking/:bookingId', getVaultByBooking);
router.post('/upload', protect(['agent']), uploadMedia);

module.exports = router;
