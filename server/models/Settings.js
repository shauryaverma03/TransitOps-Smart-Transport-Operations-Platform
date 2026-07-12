const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  depotName: { type: String, default: 'Central Hub', trim: true },
  currency: { type: String, enum: ['USD', 'EUR', 'GBP', 'INR'], default: 'USD' },
  distanceUnit: { type: String, enum: ['km', 'mi'], default: 'km' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
