const Review = require('../models/Review');
const Booking = require('../models/Booking');

// Create a review (only for completed bookings)
exports.createReview = async (req, res) => {
  try {
    const { bookingId, packageId, rating, comment } = req.body;

    // Verify the booking belongs to the user and is completed
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id,
      bookingStatus: 'completed'
    });
    if (!booking) {
      return res.status(400).json({ success: false, error: 'Only completed bookings can be reviewed' });
    }

    // Check if already reviewed
    const existing = await Review.findOne({ user: req.user.id, booking: bookingId });
    if (existing) {
      return res.status(400).json({ success: false, error: 'You have already reviewed this booking' });
    }

    const review = await Review.create({
      user: req.user.id,
      package: packageId,
      booking: bookingId,
      rating,
      comment
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all reviews for a package
exports.getPackageReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ package: req.params.packageId })
      .populate('user', 'fullName profilePhoto')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.json({ success: true, reviews, avgRating: parseFloat(avgRating), totalReviews: reviews.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
