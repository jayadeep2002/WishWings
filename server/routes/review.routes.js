const express = require('express');
const router = express.Router();
const { createReview, getPackageReviews } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

// Public: get reviews for a package
router.get('/package/:packageId', getPackageReviews);

// Protected: create review
router.post('/', protect(['user']), createReview);

module.exports = router;
