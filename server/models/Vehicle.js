const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['Heavy Duty', 'Light Commercial', 'Electric Van', 'Long Haul', 'Light Duty', 'Other'],
    required: true
  },
  maxLoadCapacity: { type: Number, required: true, min: 0 }, // kg
  odometer: { type: Number, default: 0, min: 0 }, // km
  acquisitionCost: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
    default: 'Available'
  }
}, { timestamps: true });

// Index for fast lookups
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ type: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);
