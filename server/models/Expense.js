const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  toll: { type: Number, default: 0, min: 0 },
  other: { type: Number, default: 0, min: 0 },
  maintenanceCost: { type: Number, default: 0, min: 0 },
  total: { type: Number, default: 0 }, // auto-computed
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

// Auto-compute total before save
expenseSchema.pre('save', function(next) {
  this.total = (this.toll || 0) + (this.other || 0) + (this.maintenanceCost || 0);
  next();
});

expenseSchema.index({ trip: 1 });
expenseSchema.index({ vehicle: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
