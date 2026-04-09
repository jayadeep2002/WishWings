const User = require('../models/User');
const Agent = require('../models/Agent');
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const Admin = require('../models/Admin');

exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    res.json({ success: true, admin });
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
    const admin = await Admin.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
    res.json({ success: true, admin });
  } catch (error) { 
    console.error('Update Admin Profile Error:', error);
    res.status(500).json({ success: false, error: error.message }); 
  }
};


exports.getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const activeAgents = await Agent.countDocuments({ isApproved: true, isActive: true });
    const registeredUsers = await User.countDocuments();
    const result = await Booking.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]);
    const totalRevenue = result.length > 0 ? result[0].total : 0;
    
    const unassignedBookingsCount = await Booking.countDocuments({ bookingStatus: 'pending', assignedAgent: null });
    const pendingAgentsCount = await Agent.countDocuments({ isApproved: false });

    res.json({ success: true, stats: { totalBookings, activeAgents, registeredUsers, totalRevenue, unassignedBookingsCount, pendingAgentsCount } });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user package assignedAgent').sort('-createdAt');
    res.json({ success: true, bookings });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user package assignedAgent');
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.assignAgent = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    
    booking.assignedAgent = req.body.agentId;
    booking.bookingStatus = 'agent_assigned';
    await booking.save();
    
    res.json({ success: true, booking });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { bookingStatus: req.body.bookingStatus }, { new: true });
    res.json({ success: true, booking });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort('-createdAt');
    res.json({ success: true, agents });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
    res.json({ success: true, agent });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.approveAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json({ success: true, agent });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.rejectAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, { isApproved: false }, { new: true });
    res.json({ success: true, agent });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.deleteAgent = async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Agent deleted' });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json({ success: true, users });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ success: true, user });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: req.body.isVerified }, { new: true });
    res.json({ success: true, user });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};
