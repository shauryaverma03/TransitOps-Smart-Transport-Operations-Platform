const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const FuelLog = require('../models/FuelLog');
const MaintenanceLog = require('../models/MaintenanceLog');
const Expense = require('../models/Expense');
const Settings = require('../models/Settings');

// GET /api/analytics/summary
const getAnalyticsSummary = async (req, res) => {
  try {
    const settings = await Settings.findOne() || { distanceUnit: 'km' };
    const KM_TO_MI = 0.621371;
    const isMetric = settings.distanceUnit === 'km';

    // Fuel efficiency: total km / total liters
    const [fuelAgg, completedTrips, vehicles, maintenanceAgg] = await Promise.all([
      FuelLog.aggregate([{ $group: { _id: null, totalLiters: { $sum: '$liters' }, totalFuelCost: { $sum: '$cost' } } }]),
      Trip.find({ status: 'Completed' }).populate('vehicle', 'acquisitionCost registrationNumber name'),
      Vehicle.find(),
      MaintenanceLog.aggregate([
        { $group: { _id: '$vehicle', totalMaintenanceCost: { $sum: '$cost' } } }
      ])
    ]);

    const totalLiters = fuelAgg[0]?.totalLiters || 0;
    const totalFuelCost = fuelAgg[0]?.totalFuelCost || 0;

    // Total planned distance from completed trips
    const totalDistanceKm = completedTrips.reduce((sum, t) => sum + (t.plannedDistance || 0), 0);
    const totalDistance = isMetric ? totalDistanceKm : totalDistanceKm * KM_TO_MI;

    const fuelEfficiency = totalLiters > 0
      ? Math.round((totalDistance / totalLiters) * 100) / 100
      : 0;

    // Fleet utilization
    const totalVehicles = vehicles.length;
    const onTripCount = vehicles.filter(v => v.status === 'On Trip').length;
    const fleetUtilization = totalVehicles > 0 ? Math.round((onTripCount / totalVehicles) * 100 * 10) / 10 : 0;

    // Total revenue
    const totalRevenue = completedTrips.reduce((sum, t) => sum + (t.revenue || 0), 0);

    // Maintenance cost map by vehicle
    const maintMap = {};
    maintenanceAgg.forEach(m => { maintMap[String(m._id)] = m.totalMaintenanceCost; });

    // Fuel cost map by vehicle
    const fuelByVehicle = await FuelLog.aggregate([
      { $group: { _id: '$vehicle', totalFuel: { $sum: '$cost' } } }
    ]);
    const fuelMap = {};
    fuelByVehicle.forEach(f => { fuelMap[String(f._id)] = f.totalFuel; });

    // Per-vehicle ROI: (Revenue − (Maintenance + Fuel)) / AcquisitionCost
    const vehicleRevenues = {};
    completedTrips.forEach(t => {
      const vId = String(t.vehicle?._id);
      vehicleRevenues[vId] = (vehicleRevenues[vId] || 0) + (t.revenue || 0);
    });

    const vehicleROI = vehicles.map(v => {
      const vId = String(v._id);
      const rev = vehicleRevenues[vId] || 0;
      const maint = maintMap[vId] || 0;
      const fuel = fuelMap[vId] || 0;
      const roi = v.acquisitionCost > 0
        ? Math.round(((rev - (maint + fuel)) / v.acquisitionCost) * 10000) / 100
        : 0;
      return { vehicle: v, roi, revenue: rev, maintenanceCost: maint, fuelCost: fuel, totalCost: maint + fuel };
    });

    // Top costliest vehicles by total operational cost
    const topCostly = [...vehicleROI]
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 8);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Trip.aggregate([
      { $match: { status: 'Completed', completedAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$completedAt' }, month: { $month: '$completedAt' } },
          revenue: { $sum: '$revenue' },
          trips: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenueFormatted = monthlyRevenue.map(m => ({
      month: `${monthNames[m._id.month - 1]} ${m._id.year}`,
      revenue: m.revenue,
      trips: m.trips
    }));

    const totalOperationalCost = totalFuelCost + (maintenanceAgg.reduce((sum, m) => sum + m.totalMaintenanceCost, 0));
    const overallROI = totalRevenue > 0 && vehicles.length > 0
      ? Math.round(((totalRevenue - totalOperationalCost) / vehicles.reduce((sum, v) => sum + v.acquisitionCost, 0)) * 10000) / 100
      : 0;

    res.json({
      summary: {
        fuelEfficiency,
        fuelEfficiencyUnit: isMetric ? 'km/L' : 'mi/L',
        fleetUtilization,
        totalOperationalCost,
        totalRevenue,
        overallROI,
        totalFuelCost,
        totalLiters,
        distanceUnit: settings.distanceUnit
      },
      topCostlyVehicles: topCostly,
      monthlyRevenue: monthlyRevenueFormatted,
      vehicleROI
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/analytics/export/csv
const exportCSV = async (req, res) => {
  try {
    const trips = await Trip.find({ status: 'Completed' })
      .populate('vehicle', 'registrationNumber name type acquisitionCost')
      .populate('driver', 'name licenseNumber')
      .lean();

    const fuelLogs = await FuelLog.find()
      .populate('vehicle', 'registrationNumber name')
      .lean();

    const expenses = await Expense.find()
      .populate('vehicle', 'registrationNumber name')
      .populate('trip', 'tripId')
      .lean();

    res.json({ trips, fuelLogs, expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalyticsSummary, exportCSV };
