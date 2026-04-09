const User = require('../models/User');
const Booking = require('../models/Booking');
const ReactionVault = require('../models/ReactionVault');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.updateProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      if (req.file.destination) {
        updateData.profilePhoto = `/uploads/${req.file.filename}`;
      } else {
        updateData.profilePhoto = req.file.path;
      }
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (error) { 
    console.error('Update Profile Error:', error);
    res.status(500).json({ success: false, error: error.message }); 
  }
};


exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('package assignedAgent').sort('-createdAt');
    res.json({ success: true, bookings });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id }).populate('package assignedAgent');
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.trackAgent = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id }).select('agentLiveLocation bookingStatus assignedAgent');
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.getReactionVault = async (req, res) => {
  try {
    const media = await ReactionVault.find({ booking: req.params.bookingId, user: req.user.id });
    res.json({ success: true, media });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};
