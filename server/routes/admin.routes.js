const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { 
  getProfile, updateProfile, getDashboardStats, getAllBookings, getBookingById, assignAgent, updateBookingStatus,
  getAllAgents, getAgentById, approveAgent, rejectAgent, deleteAgent,
  getAllUsers, getUserById, verifyUser, deleteUser 
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect(['admin']));

router.route('/profile')
  .get(getProfile)
  .put(upload.single('profilePhoto'), updateProfile);

router.get('/dashboard', getDashboardStats);

router.route('/bookings').get(getAllBookings);
router.route('/bookings/:id').get(getBookingById);
router.put('/bookings/:id/assign', assignAgent);
router.put('/bookings/:id/status', updateBookingStatus);

router.route('/agents').get(getAllAgents);
router.route('/agents/:id').get(getAgentById).delete(deleteAgent);
router.put('/agents/:id/approve', approveAgent);
router.put('/agents/:id/reject', rejectAgent);

router.route('/users').get(getAllUsers);
router.route('/users/:id').get(getUserById).delete(deleteUser);
router.put('/users/:id/verify', verifyUser);

module.exports = router;
