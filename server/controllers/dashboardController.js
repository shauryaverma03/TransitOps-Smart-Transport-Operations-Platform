const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const MaintenanceLog = require('../models/MaintenanceLog');

// GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    const { type: vehicleType, status: vehicleStatus } = req.query;

    const vehicleFilter = {};
    if (vehicleType) vehicleFilter.type = vehicleType;
    if (vehicleStatus) vehicleFilter.status = vehicleStatus;

    const [
      totalVehicles, activeVehicles, availableVehicles, inMaintenanceVehicles, retiredVehicles, onTripVehicles,
      activeTrips, pendingTrips,
      driversOnDuty,
      recentTrips,
      vehicleStatusCounts
    ] = await Promise.all([
      Vehicle.countDocuments(vehicleFilter),
      Vehicle.countDocuments({ ...vehicleFilter, status: { $in: ['Available', 'On Trip'] } }),
      Vehicle.countDocuments({ ...vehicleFilter, status: 'Available' }),
      Vehicle.countDocuments({ ...vehicleFilter, status: 'In Shop' }),
      Vehicle.countDocuments({ ...vehicleFilter, status: 'Retired' }),
      Vehicle.countDocuments({ ...vehicleFilter, status: 'On Trip' }),
      Trip.countDocuments({ status: 'Dispatched' }),
      Trip.countDocuments({ status: 'Draft' }),
      Driver.countDocuments({ status: 'On Trip' }),
      Trip.find({ status: { $in: ['Dispatched', 'Completed', 'Draft'] } })
        .populate('vehicle', 'registrationNumber name type')
        .populate('driver', 'name')
        .sort({ updatedAt: -1 })
        .limit(10),
      Vehicle.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const fleetUtilization = totalVehicles > 0
      ? Math.round((onTripVehicles / totalVehicles) * 100 * 10) / 10
      : 0;

    const statusMap = {};
    vehicleStatusCounts.forEach(s => { statusMap[s._id] = s.count; });

    res.json({
      kpi: {
        totalVehicles,
        activeVehicles,
        availableVehicles,
        inMaintenanceVehicles,
        retiredVehicles,
        onTripVehicles,
        activeTrips,
        pendingTrips,
        driversOnDuty,
        fleetUtilization
      },
      vehicleStatusDistribution: {
        available: statusMap['Available'] || 0,
        onTrip: statusMap['On Trip'] || 0,
        inShop: statusMap['In Shop'] || 0,
        retired: statusMap['Retired'] || 0
      },
      recentTrips
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
