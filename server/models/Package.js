const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, enum: [
    'birthday', 'anniversary', 'welcome home', 'baby shower', 'graduation',
    'engagement', 'wedding', 'housewarming', 'retirement', "valentine's day",
    "mother's day", "father's day", 'farewell', 'promotion', 'gifts', 'surprise', 'custom'
  ] },
  includes: [{ type: String }],
  coverImage: { type: String, default: '' },
  duration: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
