const mongoose = require('mongoose');

const reactionVaultSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mediaType: { type: String, enum: ['photo', 'video'], required: true },
  mediaUrl: { type: String, required: true },
  caption: { type: String },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ReactionVault', reactionVaultSchema);
