const ReactionVault = require('../models/ReactionVault');

// @desc    Upload media to Reaction Vault
// @route   POST /api/reaction-vault/upload
// @access  Private (Agent)
exports.uploadMedia = async (req, res) => {
  console.log('[DEBUG] Hit ReactionVault.uploadMedia');
  try {
    if (!req.body) {
      console.error('[ERROR] req.body is undefined in ReactionVault.uploadMedia');
      return res.status(400).json({ success: false, error: 'Request body is missing' });
    }
    const { bookingId, userId, mediaType, mediaUrl, caption } = req.body;
    
    const reaction = await ReactionVault.create({
      booking: bookingId,
      agent: req.user.id,
      user: userId,
      mediaType,
      mediaUrl,
      caption
    });
    
    res.status(201).json({ success: true, reaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get vault media for a specific booking
// @route   GET /api/reaction-vault/booking/:bookingId
// @access  Private (User/Agent/Admin)
exports.getVaultByBooking = async (req, res) => {
  try {
    const reactions = await ReactionVault.find({ booking: req.params.bookingId })
      .populate('agent', 'fullName')
      .sort({ createdAt: -1 });
      
    res.json({ success: true, reactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all vault media for the logged-in user
// @route   GET /api/reaction-vault/my-vault
// @access  Private (User)
exports.getMyVault = async (req, res) => {
  try {
    const reactions = await ReactionVault.find({ user: req.user.id })
      .populate('booking')
      .populate('agent', 'fullName')
      .sort({ createdAt: -1 });
      
    res.json({ success: true, reactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
