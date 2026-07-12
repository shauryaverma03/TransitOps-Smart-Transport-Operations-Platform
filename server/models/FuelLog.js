const mongoose = require('mongoose');

const fuelLogSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null },
  date: { type: Date, required: true },
  liters: { type: Number, required: true, min: 0 },
  cost: { type: Number, required: true, min: 0 }
}, { timestamps: true });

fuelLogSchema.index({ vehicle: 1 });
fuelLogSchema.index({ trip: 1 });

module.exports = mongoose.model('FuelLog', fuelLogSchema);
