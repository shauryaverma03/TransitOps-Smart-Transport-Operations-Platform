const Driver = require('../models/Driver');

// GET /api/drivers
const getDrivers = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } }
      ];
    }
    const drivers = await Driver.find(filter).sort({ createdAt: -1 });
    // Add computed fields
    const now = new Date();
    const enriched = drivers.map(d => ({
      ...d.toObject(),
      isLicenseExpired: d.licenseExpiry < now
    }));
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/drivers/available — eligible for dispatch
const getAvailableDrivers = async (req, res) => {
  try {
    const now = new Date();
    const drivers = await Driver.find({
      status: 'Available',
      licenseExpiry: { $gte: now }
    }).sort({ name: 1 });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/drivers/:id
const getDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found.' });
    const now = new Date();
    res.json({ ...driver.toObject(), isLicenseExpired: driver.licenseExpiry < now });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/drivers
const createDriver = async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'License number must be unique.' });
    }
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/drivers/:id
const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!driver) return res.status(404).json({ message: 'Driver not found.' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/drivers/:id
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found.' });
    res.json({ message: 'Driver deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDrivers, getAvailableDrivers, getDriver, createDriver, updateDriver, deleteDriver };
