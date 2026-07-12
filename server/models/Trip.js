const mongoose = require('mongoose');
const Counter = require('./Counter');

const tripSchema = new mongoose.Schema({
  tripId: { type: String, unique: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  source: { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  cargoWeight: { type: Number, required: true, min: 0 }, // kg
  plannedDistance: { type: Number, required: true, min: 0 }, // km
  status: {
    type: String,
    enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
    default: 'Draft'
  },
  // Completion cascade fields
  finalOdometer: { type: Number, default: null },
  revenue: { type: Number, default: 0 },
  // Cascade steps tracking
  completionStep: { type: Number, default: 0 }, // 0=not started, 1=odometer done, 2=fuel done, 3=completed
  // Timestamps
  dispatchedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  cancelledAt: { type: Date, default: null }
}, { timestamps: true });

// Auto-generate tripId before save
tripSchema.pre('save', async function(next) {
  if (!this.tripId) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'trip' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.tripId = `TR-${String(counter.seq).padStart(4, '0')}`;
  }
  next();
});

tripSchema.index({ status: 1 });
tripSchema.index({ vehicle: 1 });
tripSchema.index({ driver: 1 });

module.exports = mongoose.model('Trip', tripSchema);
