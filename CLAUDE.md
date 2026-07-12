# CLAUDE.md — TransitOps Project Memory

## Project Summary
TransitOps is a centralized transport operations platform that digitizes vehicle, driver, dispatch,
maintenance, and expense management for logistics companies. Hackathon project.

## Tech Stack
- **Frontend**: React 18 + Vite, Tailwind CSS v3, Recharts, papaparse, Axios, React Router v6
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (jsonwebtoken) + bcrypt, role embedded in token
- **Design**: Dark mode, Inter font, Material-style color tokens from stitch design files

## Architecture Decisions
- JWT stored in localStorage (hackathon scope; production would use httpOnly cookie)
- Role is user-selected at login (user picks from dropdown matching their account role)
- Account lockout after 5 failed attempts tracked in DB (`failedAttempts`, `lockedUntil`)
- Trip completion is a 4-step cascade wizard — not a single button — enforced server-side
- Dispatcher has Fleet access (following mockup, overriding written brief)
- Safety Officer has Dashboard view access (following mockup)
- Revenue field added to Trip schema for ROI calculation
- 4 demo users seeded (one per role) for demo purposes

## Entities & Schema

### User
```
email (unique), passwordHash, role: enum[Fleet Manager, Dispatcher, Safety Officer, Financial Analyst],
failedAttempts: Number (default 0), lockedUntil: Date, createdAt
```

### Vehicle
```
registrationNumber (unique), name, type: enum[Heavy Duty, Light Commercial, Electric Van, Long Haul, Light Duty, Other],
maxLoadCapacity (kg), odometer (km), acquisitionCost, status: enum[Available, On Trip, In Shop, Retired], createdAt
```

### Driver
```
name, licenseNumber, licenseCategory, licenseExpiry (Date), contact,
tripCompletionRate (%), safetyScore, status: enum[Available, On Trip, Off Duty, Suspended], createdAt
```

### Trip
```
tripId (auto: TR-XXXX), vehicle: ObjectId→Vehicle, driver: ObjectId→Driver,
source, destination, cargoWeight (kg), plannedDistance (km),
status: enum[Draft, Dispatched, Completed, Cancelled],
finalOdometer, revenue, dispatchedAt, completedAt, cancelledAt, createdAt
```

### MaintenanceLog
```
vehicle: ObjectId→Vehicle, serviceType, cost, date, status: enum[Active, Resolved], notes, createdAt
```

### FuelLog
```
vehicle: ObjectId→Vehicle, trip: ObjectId→Trip (optional), date, liters, cost, createdAt
```

### Expense
```
trip: ObjectId→Trip, vehicle: ObjectId→Vehicle, toll, other, maintenanceCost,
total (auto = toll+other+maintenanceCost), status: enum[Pending, Approved, Rejected], createdAt
```

### Settings
```
depotName, currency: enum[USD, EUR, GBP], distanceUnit: enum[km, mi], updatedAt
```

## Business Rules Implemented (Checklist)
- [ ] Vehicle registration number must be unique
- [ ] Retired or In Shop vehicles never appear in dispatch selection dropdown
- [ ] Drivers with expired licenses OR Suspended status cannot be assigned to trips
- [ ] A vehicle or driver already On Trip cannot be assigned to another trip
- [ ] Cargo weight must not exceed vehicle's max load capacity
- [ ] Dispatching a trip auto-changes vehicle AND driver status to On Trip
- [ ] Completing a trip (via cascade) auto-reverts vehicle AND driver to Available
- [ ] Cancelling a dispatched trip restores vehicle and driver to Available
- [ ] Creating an active maintenance record auto-sets vehicle status to In Shop
- [ ] Closing maintenance restores vehicle to Available (unless Retired)

## Build Progress Log

### [2026-07-12] Initial Setup
- CLAUDE.md created (this file)
- Implementation plan approved
- Build starting: scaffolding → auth → CRUD → trips → maintenance → fuel/expenses → dashboard → analytics → polish

## API Routes (Living Table)

### Auth
| Method | Path | Purpose | Role |
|---|---|---|---|
| POST | /api/auth/login | Login | Public |
| GET | /api/auth/me | Current user | Any |

### Vehicles
| Method | Path | Purpose | Role |
|---|---|---|---|
| GET | /api/vehicles | List all | FM, Dispatcher |
| GET | /api/vehicles/available | Dispatch-eligible | FM, Dispatcher |
| POST | /api/vehicles | Create | FM |
| PUT | /api/vehicles/:id | Update | FM |
| DELETE | /api/vehicles/:id | Delete | FM |

### Drivers
| Method | Path | Purpose | Role |
|---|---|---|---|
| GET | /api/drivers | List all | FM, Dispatcher, SO |
| GET | /api/drivers/available | Dispatch-eligible | FM, Dispatcher |
| POST | /api/drivers | Create | Dispatcher, SO |
| PUT | /api/drivers/:id | Update | Dispatcher, SO |
| DELETE | /api/drivers/:id | Delete | SO |

### Trips
| Method | Path | Purpose | Role |
|---|---|---|---|
| GET | /api/trips | List all | FM, Dispatcher |
| POST | /api/trips | Create (Draft) | Dispatcher |
| PUT | /api/trips/:id/dispatch | Dispatch | Dispatcher |
| PUT | /api/trips/:id/complete | Step 1: Odometer | Dispatcher |
| PUT | /api/trips/:id/fuel | Step 2: Fuel log | Dispatcher |
| PUT | /api/trips/:id/expenses | Step 3: Expenses + finalize | Dispatcher |
| PUT | /api/trips/:id/cancel | Cancel | Dispatcher |

### Maintenance
| Method | Path | Purpose | Role |
|---|---|---|---|
| GET | /api/maintenance | List | FM |
| POST | /api/maintenance | Create (sets In Shop) | FM |
| PUT | /api/maintenance/:id/resolve | Resolve (sets Available) | FM |
| PUT | /api/maintenance/:id | Update | FM |
| DELETE | /api/maintenance/:id | Delete | FM |

### Fuel / Expenses / Dashboard / Analytics
| Method | Path | Purpose | Role |
|---|---|---|---|
| GET/POST | /api/fuel | CRUD | FA, FM |
| GET/POST | /api/expenses | CRUD | FA, FM |
| GET | /api/dashboard/stats | KPI aggregations | FM, Dispatcher, FA |
| GET | /api/analytics/summary | ROI/efficiency data | FM, FA, SO |
| GET | /api/analytics/export/csv | CSV export | FM, FA |
| GET/PUT | /api/settings | Settings | FM |

## Known Issues / TODO
- Revenue tracking: trips have optional `revenue` field; if not set, ROI shows 0
- PDF export: bonus feature, not yet implemented

## Bonus Features Status
- [ ] Search / filter / sort
- [ ] Dark mode (default — always dark)
- [ ] PDF export
- [ ] Vehicle document uploads
- [ ] Email reminders for expiring licenses
