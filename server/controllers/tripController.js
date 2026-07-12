const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const FuelLog = require('../models/FuelLog');
const Expense = require('../models/Expense');

// GET /api/trips
const getTrips = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;

    let trips = await Trip.find(filter)
      .populate('vehicle', 'registrationNumber name type')
      .populate('driver', 'name licenseNumber')
      .sort({ createdAt: -1 });

    if (search) {
      trips = trips.filter(t =>
        t.tripId?.includes(search.toUpperCase()) ||
        t.vehicle?.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.driver?.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.source?.toLowerCase().includes(search.toLowerCase()) ||
        t.destination?.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/trips/:id
const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('vehicle')
      .populate('driver');
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/trips — Create Draft
const createTrip = async (req, res) => {
  try {
    const { vehicle: vehicleId, driver: driverId, source, destination, cargoWeight, plannedDistance, revenue } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: 'Driver not found.' });

    const trip = new Trip({ vehicle: vehicleId, driver: driverId, source, destination, cargoWeight, plannedDistance, revenue });
    await trip.save();
    await trip.populate('vehicle driver');
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/trips/:id/dispatch — Full validation + dispatch
const dispatchTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('vehicle').populate('driver');
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });
    if (trip.status !== 'Draft') {
      return res.status(400).json({ message: `Trip cannot be dispatched. Current status: ${trip.status}` });
    }

    const vehicle = trip.vehicle;
    const driver = trip.driver;

    // Business rule: vehicle must be Available (not Retired or In Shop)
    if (vehicle.status !== 'Available') {
      return res.status(400).json({
        message: `Vehicle is not available for dispatch. Current status: ${vehicle.status}`
      });
    }

    // Business rule: driver must be Available
    if (driver.status !== 'Available') {
      return res.status(400).json({
        message: `Driver is not available. Current status: ${driver.status}`
      });
    }

    // Business rule: driver license must not be expired
    if (driver.licenseExpiry < new Date()) {
      return res.status(400).json({
        message: `Driver's license expired on ${driver.licenseExpiry.toISOString().split('T')[0]}. Cannot dispatch.`
      });
    }

    // Business rule: driver must not be Suspended
    if (driver.status === 'Suspended') {
      return res.status(400).json({ message: 'Suspended driver cannot be assigned to trips.' });
    }

    // Business rule: cargo weight must not exceed vehicle max load capacity
    if (trip.cargoWeight > vehicle.maxLoadCapacity) {
      const excess = trip.cargoWeight - vehicle.maxLoadCapacity;
      return res.status(400).json({
        message: `Capacity exceeded by ${excess} kg — dispatch blocked. Vehicle max: ${vehicle.maxLoadCapacity} kg, Cargo: ${trip.cargoWeight} kg`
      });
    }

    // All checks pass — dispatch
    trip.status = 'Dispatched';
    trip.dispatchedAt = new Date();
    await trip.save();

    // Auto-set vehicle and driver to On Trip
    await Vehicle.findByIdAndUpdate(vehicle._id, { status: 'On Trip' });
    await Driver.findByIdAndUpdate(driver._id, { status: 'On Trip' });

    const updated = await Trip.findById(trip._id).populate('vehicle').populate('driver');
    res.json({ message: 'Trip dispatched successfully.', trip: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/trips/:id/complete — Step 1: capture final odometer
const completeTripStep1 = async (req, res) => {
  try {
    const { finalOdometer } = req.body;
    if (!finalOdometer || finalOdometer <= 0) {
      return res.status(400).json({ message: 'Final odometer reading is required.' });
    }

    const trip = await Trip.findById(req.params.id).populate('vehicle');
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });
    if (trip.status !== 'Dispatched') {
      return res.status(400).json({ message: 'Only dispatched trips can be completed.' });
    }
    if (finalOdometer < trip.vehicle.odometer) {
      return res.status(400).json({ message: `Final odometer (${finalOdometer}) cannot be less than current odometer (${trip.vehicle.odometer}).` });
    }

    trip.finalOdometer = finalOdometer;
    trip.completionStep = 1;
    await trip.save();

    res.json({ message: 'Step 1 complete. Odometer recorded.', trip, nextStep: 'fuel' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/trips/:id/fuel — Step 2: log fuel
const completeTripStep2 = async (req, res) => {
  try {
    const { liters, cost } = req.body;
    if (!liters || !cost) {
      return res.status(400).json({ message: 'Fuel liters and cost are required.' });
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });
    if (trip.completionStep !== 1) {
      return res.status(400).json({ message: 'Please complete Step 1 (odometer) first.' });
    }

    // Create fuel log
    const fuelLog = new FuelLog({
      vehicle: trip.vehicle,
      trip: trip._id,
      date: new Date(),
      liters,
      cost
    });
    await fuelLog.save();

    trip.completionStep = 2;
    await trip.save();

    res.json({ message: 'Step 2 complete. Fuel log created.', fuelLog, nextStep: 'expenses' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/trips/:id/expenses — Step 3: log expenses + finalize
const completeTripStep3 = async (req, res) => {
  try {
    const { toll = 0, other = 0, maintenanceCost = 0 } = req.body;

    const trip = await Trip.findById(req.params.id).populate('vehicle').populate('driver');
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });
    if (trip.completionStep !== 2) {
      return res.status(400).json({ message: 'Please complete Step 2 (fuel) first.' });
    }

    // Create expense record
    const expense = new Expense({
      trip: trip._id,
      vehicle: trip.vehicle._id,
      toll,
      other,
      maintenanceCost
    });
    await expense.save();

    // Update odometer on vehicle
    await Vehicle.findByIdAndUpdate(trip.vehicle._id, {
      status: 'Available',
      odometer: trip.finalOdometer
    });

    // Revert driver to Available + increment trip completion rate
    const driver = await Driver.findById(trip.driver._id);
    const totalTrips = await Trip.countDocuments({ driver: driver._id, status: 'Completed' }) + 1;
    const completedTrips = totalTrips;
    const completionRate = Math.round((completedTrips / totalTrips) * 100);

    await Driver.findByIdAndUpdate(trip.driver._id, {
      status: 'Available',
      tripCompletionRate: completionRate
    });

    // Mark trip completed
    trip.status = 'Completed';
    trip.completedAt = new Date();
    trip.completionStep = 3;
    await trip.save();

    const updated = await Trip.findById(trip._id).populate('vehicle').populate('driver');
    res.json({
      message: 'Trip completed successfully. Vehicle and driver reverted to Available.',
      trip: updated,
      expense
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/trips/:id/cancel
const cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('vehicle').populate('driver');
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });

    if (!['Draft', 'Dispatched'].includes(trip.status)) {
      return res.status(400).json({ message: `Cannot cancel a ${trip.status} trip.` });
    }

    const wasDispatched = trip.status === 'Dispatched';

    trip.status = 'Cancelled';
    trip.cancelledAt = new Date();
    await trip.save();

    // Revert statuses only if was dispatched
    if (wasDispatched) {
      await Vehicle.findByIdAndUpdate(trip.vehicle._id, { status: 'Available' });
      await Driver.findByIdAndUpdate(trip.driver._id, { status: 'Available' });
    }

    res.json({ message: 'Trip cancelled. Vehicle and driver reverted to Available.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrips, getTrip, createTrip,
  dispatchTrip,
  completeTripStep1, completeTripStep2, completeTripStep3,
  cancelTrip
};
