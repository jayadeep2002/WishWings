const express = require('express');
const router = express.Router();
const { addToWishlist, removeFromWishlist, getMyWishlist, getWishlistIds } = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect(['user']));

router.post('/', addToWishlist);
router.delete('/:packageId', removeFromWishlist);
router.get('/', getMyWishlist);
router.get('/ids', getWishlistIds);

module.exports = router;
