const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  licenseNumber: { type: String, required: true, unique: true, trim: true },
  licenseCategory: { type: String, required: true, trim: true },
  licenseExpiry: { type: Date, required: true },
  contact: { type: String, required: true, trim: true },
  tripCompletionRate: { type: Number, default: 0, min: 0, max: 100 }, // percentage
  safetyScore: { type: Number, default: 100, min: 0, max: 100 },
  status: {
    type: String,
    enum: ['Available', 'On Trip', 'Off Duty', 'Suspended'],
    default: 'Available'
  }
}, { timestamps: true });

// Virtual: is license expired?
driverSchema.virtual('isLicenseExpired').get(function() {
  return this.licenseExpiry < new Date();
});

// Check if driver is eligible for dispatch
driverSchema.methods.isEligibleForDispatch = function() {
  if (this.status !== 'Available') return { eligible: false, reason: `Driver status is ${this.status}` };
  if (this.licenseExpiry < new Date()) return { eligible: false, reason: 'Driver license is expired' };
  return { eligible: true };
};

driverSchema.index({ status: 1 });

module.exports = mongoose.model('Driver', driverSchema);
