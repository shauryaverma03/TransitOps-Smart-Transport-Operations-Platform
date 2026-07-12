const MaintenanceLog = require('../models/MaintenanceLog');
const Vehicle = require('../models/Vehicle');

// GET /api/maintenance
const getMaintenanceLogs = async (req, res) => {
  try {
    const { status, vehicleId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (vehicleId) filter.vehicle = vehicleId;
    const logs = await MaintenanceLog.find(filter)
      .populate('vehicle', 'registrationNumber name type status')
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/maintenance/:id
const getMaintenanceLog = async (req, res) => {
  try {
    const log = await MaintenanceLog.findById(req.params.id).populate('vehicle');
    if (!log) return res.status(404).json({ message: 'Maintenance log not found.' });
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/maintenance — Creates log and sets vehicle to In Shop
const createMaintenanceLog = async (req, res) => {
  try {
    const { vehicle: vehicleId, serviceType, cost, date, notes } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });

    if (vehicle.status === 'On Trip') {
      return res.status(400).json({ message: 'Cannot create maintenance for a vehicle that is On Trip.' });
    }

    const log = new MaintenanceLog({ vehicle: vehicleId, serviceType, cost, date, notes, status: 'Active' });
    await log.save();

    // BUSINESS RULE: active maintenance auto-sets vehicle to In Shop
    await Vehicle.findByIdAndUpdate(vehicleId, { status: 'In Shop' });

    await log.populate('vehicle');
    res.status(201).json({ message: 'Maintenance log created. Vehicle status set to In Shop.', log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/maintenance/:id/resolve — Resolve and revert vehicle to Available
const resolveMaintenanceLog = async (req, res) => {
  try {
    const log = await MaintenanceLog.findById(req.params.id).populate('vehicle');
    if (!log) return res.status(404).json({ message: 'Maintenance log not found.' });
    if (log.status === 'Resolved') {
      return res.status(400).json({ message: 'Maintenance log already resolved.' });
    }

    log.status = 'Resolved';
    await log.save();

    // BUSINESS RULE: closing maintenance reverts vehicle to Available UNLESS Retired
    const vehicle = await Vehicle.findById(log.vehicle._id);
    if (vehicle && vehicle.status !== 'Retired') {
      await Vehicle.findByIdAndUpdate(vehicle._id, { status: 'Available' });
    }

    res.json({ message: 'Maintenance resolved. Vehicle reverted to Available.', log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/maintenance/:id
const updateMaintenanceLog = async (req, res) => {
  try {
    const log = await MaintenanceLog.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('vehicle');
    if (!log) return res.status(404).json({ message: 'Maintenance log not found.' });
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/maintenance/:id
const deleteMaintenanceLog = async (req, res) => {
  try {
    const log = await MaintenanceLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ message: 'Maintenance log not found.' });
    res.json({ message: 'Maintenance log deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMaintenanceLogs, getMaintenanceLog,
  createMaintenanceLog, resolveMaintenanceLog,
  updateMaintenanceLog, deleteMaintenanceLog
};
