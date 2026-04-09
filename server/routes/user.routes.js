const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getUserBookings, getBookingById, trackAgent, getReactionVault } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const upload = require('../middleware/upload');

router.use(protect(['user']));

router.route('/profile')
  .get(getProfile)
  .put(upload.single('profilePhoto'), updateProfile);

router.route('/bookings')
  .get(getUserBookings);

router.route('/bookings/:id')
  .get(getBookingById);

router.route('/bookings/:id/track')
  .get(trackAgent);

router.route('/vault/:bookingId')
  .get(getReactionVault);

module.exports = router;
