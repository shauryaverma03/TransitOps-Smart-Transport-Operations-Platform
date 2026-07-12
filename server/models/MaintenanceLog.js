const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  serviceType: { type: String, required: true, trim: true },
  cost: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Active', 'Resolved'],
    default: 'Active'
  },
  notes: { type: String, trim: true, default: '' }
}, { timestamps: true });

maintenanceLogSchema.index({ vehicle: 1 });
maintenanceLogSchema.index({ status: 1 });

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);
