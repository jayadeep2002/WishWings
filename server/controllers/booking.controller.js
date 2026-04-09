const Booking = require('../models/Booking');
const Package = require('../models/Package');
const Agent = require('../models/Agent');
const { sendBookingConfirmationEmail } = require('../utils/sendEmail');

exports.createBooking = async (req, res) => {
  try {
    const { package, recipientName, recipientPhone, recipientAddress, recipientCity, recipientState, recipientPincode, occasion, eventDate, eventTime, specialInstructions, totalAmount } = req.body;
    
    const booking = await Booking.create({
      user: req.user.id,
      package,
      recipientName, recipientPhone, recipientAddress, recipientCity, recipientState, recipientPincode,
      occasion, eventDate, eventTime, specialInstructions, totalAmount
    });
    
    try {
      if (req.user.email) {
        await sendBookingConfirmationEmail(req.user.email, booking);
      }
    } catch(err) {
      console.log('Email sending failed, but booking created');
    }

    res.status(201).json({ success: true, booking });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user package assignedAgent');
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to view this booking' });
    }
    
    res.json({ success: true, booking });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('package assignedAgent')
      .sort('-createdAt');
    res.json({ success: true, bookings });
  } catch (error) { 
    console.error('Error in getMyBookings:', error);
    res.status(500).json({ success: false, error: error.message }); 
  }
};
