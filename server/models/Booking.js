const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', default: null },
  recipientName: { type: String, required: true },
  recipientPhone: { type: String, required: true },
  recipientAddress: { type: String, required: true },
  recipientCity: { type: String, required: true },
  recipientState: { type: String, required: true },
  recipientPincode: { type: String, required: true },
  occasion: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventTime: { type: String, required: true },
  specialInstructions: { type: String },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  bookingStatus: { type: String, enum: ['pending', 'confirmed', 'agent_assigned', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
  agentLiveLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  reactionVideos: [{ type: String }],
  reactionPhotos: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
