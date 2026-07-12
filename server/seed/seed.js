require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Settings = require('../models/Settings');
const Trip = require('../models/Trip');
const FuelLog = require('../models/FuelLog');
const Expense = require('../models/Expense');
const MaintenanceLog = require('../models/MaintenanceLog');
const connectDB = require('../config/db');

const seedDB = async () => {
  try {
    await connectDB();
    
    // Clear existing
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Driver.deleteMany({});
    await Settings.deleteMany({});
    await Trip.deleteMany({});
    await FuelLog.deleteMany({});
    await Expense.deleteMany({});
    await MaintenanceLog.deleteMany({});
    
    console.log('Cleared existing data.');

    // 1. Create Default Settings
    await Settings.create({
      depotName: 'Central Hub - Sector 7',
      currency: 'USD',
      distanceUnit: 'km'
    });
    
    // 2. Create 4 Demo Users (Password is 'password123')
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const users = [
      { name: 'Alex Mercer', email: 'fleet@transitops.com', role: 'Fleet Manager', passwordHash },
      { name: 'Sarah Jenkins', email: 'dispatch@transitops.com', role: 'Dispatcher', passwordHash },
      { name: 'Marcus Thorne', email: 'safety@transitops.com', role: 'Safety Officer', passwordHash },
      { name: 'Elena Rostova', email: 'finance@transitops.com', role: 'Financial Analyst', passwordHash }
    ];
    await User.insertMany(users);
    console.log('Seeded 4 Demo Users (password: password123)');

    // 3. Create Sample Vehicles
    const vehicleData = [
      { registrationNumber: 'TR-992-XD', name: 'Freightliner Cascadia', type: 'Heavy Duty', maxLoadCapacity: 25000, odometer: 42109, acquisitionCost: 162500, status: 'Available' },
      { registrationNumber: 'EV-441-LL', name: 'Tesla Semi Pro', type: 'Electric Van', maxLoadCapacity: 36000, odometer: 12440, acquisitionCost: 210000, status: 'On Trip' },
      { registrationNumber: 'MK-812-ZZ', name: 'Mack Anthem 2023', type: 'Long Haul', maxLoadCapacity: 28000, odometer: 198321, acquisitionCost: 145000, status: 'In Shop' },
      { registrationNumber: 'FT-110-PP', name: 'Ford F-750 Super', type: 'Light Duty', maxLoadCapacity: 12500, odometer: 244091, acquisitionCost: 89000, status: 'Retired' },
      { registrationNumber: 'SC-770-AB', name: 'Scania R-Series', type: 'Heavy Duty', maxLoadCapacity: 30000, odometer: 8102, acquisitionCost: 178000, status: 'Available' },
    ];
    const vehicles = await Vehicle.insertMany(vehicleData);
    console.log('Seeded 5 Vehicles');

    // 4. Create Sample Drivers
    const driverData = [
      { name: 'James Miller', licenseNumber: 'DL-883921', licenseCategory: 'Class A', licenseExpiry: new Date('2028-05-12'), contact: '555-0101', tripCompletionRate: 98, safetyScore: 100, status: 'Available' },
      { name: 'Sarah Chen', licenseNumber: 'DL-992110', licenseCategory: 'Class A', licenseExpiry: new Date('2027-11-30'), contact: '555-0102', tripCompletionRate: 95, safetyScore: 92, status: 'On Trip' },
      { name: 'Robert Vance', licenseNumber: 'DL-441092', licenseCategory: 'Class B', licenseExpiry: new Date('2025-01-15'), contact: '555-0103', tripCompletionRate: 88, safetyScore: 85, status: 'Available' },
      { name: 'Helena West', licenseNumber: 'DL-773121', licenseCategory: 'Class A', licenseExpiry: new Date('2024-01-01'), contact: '555-0104', tripCompletionRate: 99, safetyScore: 98, status: 'Available' }, // Expired
      { name: 'Marcus Thorne', licenseNumber: 'DL-110921', licenseCategory: 'Class C', licenseExpiry: new Date('2029-08-22'), contact: '555-0105', tripCompletionRate: 75, safetyScore: 60, status: 'Suspended' },
    ];
    const drivers = await Driver.insertMany(driverData);
    console.log('Seeded 5 Drivers (including 1 expired, 1 suspended)');

    // 5. Seed Completed Trips for Analytics Data
    const completedTrips = [
      {
        tripId: 'TR-1001',
        vehicle: vehicles[0]._id, // Freightliner
        driver: drivers[0]._id,   // James
        source: 'New York, NY',
        destination: 'Boston, MA',
        cargoWeight: 15000,
        plannedDistance: 350,
        status: 'Completed',
        finalOdometer: 42109,
        revenue: 2500,
        completionStep: 3,
        dispatchedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        tripId: 'TR-1002',
        vehicle: vehicles[4]._id, // Scania
        driver: drivers[2]._id,   // Robert
        source: 'Chicago, IL',
        destination: 'Detroit, MI',
        cargoWeight: 18000,
        plannedDistance: 450,
        status: 'Completed',
        finalOdometer: 8102,
        revenue: 3200,
        completionStep: 3,
        dispatchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];
    const insertedTrips = await Trip.insertMany(completedTrips);

    // Fuel Logs
    await FuelLog.insertMany([
      { vehicle: vehicles[0]._id, trip: insertedTrips[0]._id, date: insertedTrips[0].completedAt, liters: 120, cost: 420 },
      { vehicle: vehicles[4]._id, trip: insertedTrips[1]._id, date: insertedTrips[1].completedAt, liters: 150, cost: 525 }
    ]);

    // Expenses
    await Expense.insertMany([
      { trip: insertedTrips[0]._id, vehicle: vehicles[0]._id, toll: 45, other: 15, maintenanceCost: 0, total: 60, status: 'Approved' },
      { trip: insertedTrips[1]._id, vehicle: vehicles[4]._id, toll: 65, other: 20, maintenanceCost: 0, total: 85, status: 'Approved' }
    ]);

    console.log('Seeded 2 Completed Trips with Fuel & Expenses for Analytics');

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
