const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback } = require('../controllers/feedback.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', submitFeedback);
router.get('/', protect(['admin']), getAllFeedback);

module.exports = router;
