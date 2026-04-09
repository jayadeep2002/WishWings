const express = require('express');
const router = express.Router();
const { createBooking, getBookingById, getMyBookings } = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect(['user', 'admin']));

router.route('/')
  .post(createBooking);

router.get('/my-bookings', getMyBookings);

router.route('/:id')
  .get(getBookingById);

module.exports = router;
