const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincodesServed: [{ type: String }],
  idProof: { type: String }, 
  profilePhoto: { type: String, default: '' },
  bio: { type: String },
  servicesOffered: [{ type: String }],
  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  role: { type: String, default: 'agent' },
  rating: { type: Number, default: 0 },
  totalJobsCompleted: { type: Number, default: 0 },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);
