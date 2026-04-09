const Wishlist = require('../models/Wishlist');

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const existing = await Wishlist.findOne({ user: req.user.id, package: req.body.packageId });
    if (existing) return res.status(400).json({ success: false, error: 'Already in wishlist' });

    await Wishlist.create({ user: req.user.id, package: req.body.packageId });
    res.status(201).json({ success: true, message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const removed = await Wishlist.findOneAndDelete({ user: req.user.id, package: req.params.packageId });
    if (!removed) return res.status(404).json({ success: false, error: 'Not in wishlist' });
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get user's wishlist
exports.getMyWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.id })
      .populate('package')
      .sort({ createdAt: -1 });
    res.json({ success: true, wishlist: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Check if a package is wishlisted (bulk check)
exports.getWishlistIds = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.id }).select('package');
    const ids = items.map(item => item.package.toString());
    res.json({ success: true, packageIds: ids });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
