const Vehicle = require('../models/Vehicle');

// GET /api/vehicles
const getVehicles = async (req, res) => {
  try {
    const { type, status, search } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { registrationNumber: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }
    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/vehicles/available — only Available vehicles for dispatch
const getAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: 'Available' }).sort({ name: 1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/vehicles/:id
const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/vehicles
const createVehicle = async (req, res) => {
  try {
    const { registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, status } = req.body;

    // Check uniqueness
    const existing = await Vehicle.findOne({ registrationNumber: registrationNumber?.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: `Registration number ${registrationNumber.toUpperCase()} already exists.` });
    }

    const vehicle = new Vehicle({ registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, status });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Registration number must be unique.' });
    }
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/vehicles/:id
const updateVehicle = async (req, res) => {
  try {
    const { registrationNumber } = req.body;

    // If changing reg number, check uniqueness
    if (registrationNumber) {
      const existing = await Vehicle.findOne({
        registrationNumber: registrationNumber.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (existing) {
        return res.status(400).json({ message: `Registration number ${registrationNumber.toUpperCase()} already exists.` });
      }
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });
    res.json(vehicle);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Registration number must be unique.' });
    }
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/vehicles/:id
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });
    res.json({ message: 'Vehicle deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getVehicles, getAvailableVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle };
