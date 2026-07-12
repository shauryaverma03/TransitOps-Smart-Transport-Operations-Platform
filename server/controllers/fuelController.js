const FuelLog = require('../models/FuelLog');

const getFuelLogs = async (req, res) => {
  try {
    const { vehicleId } = req.query;
    const filter = {};
    if (vehicleId) filter.vehicle = vehicleId;
    const logs = await FuelLog.find(filter)
      .populate('vehicle', 'registrationNumber name')
      .populate('trip', 'tripId source destination')
      .sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFuelLog = async (req, res) => {
  try {
    const log = new FuelLog(req.body);
    await log.save();
    await log.populate('vehicle', 'registrationNumber name');
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFuelLog = async (req, res) => {
  try {
    const log = await FuelLog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('vehicle', 'registrationNumber name');
    if (!log) return res.status(404).json({ message: 'Fuel log not found.' });
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFuelLog = async (req, res) => {
  try {
    const log = await FuelLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ message: 'Fuel log not found.' });
    res.json({ message: 'Fuel log deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFuelLogs, createFuelLog, updateFuelLog, deleteFuelLog };
