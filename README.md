# TransitOps-Smart-Transport-Operations-Platform# TransitOps — Smart Transport Operations Platform

TransitOps is a centralized transport operations platform that replaces spreadsheets and manual logbooks with a single system for managing the full lifecycle of a fleet — vehicle registration, driver management, trip dispatch, maintenance, fuel/expense tracking, and operational analytics.

Built for logistics teams who currently deal with scheduling conflicts, underutilized vehicles, missed maintenance windows, expired driver licenses, inaccurate expense tracking, and little to no operational visibility.

## 🚛 Overview

Logistics companies often manage vehicles, drivers, and trips manually — leading to double-bookings, safety risks from expired licenses, and no real insight into fleet costs or utilization. TransitOps digitizes the entire workflow end-to-end: register a vehicle and driver, dispatch a trip with automatic validation, track maintenance and fuel, and see the operational and financial picture on one dashboard.

## 👥 Target Users

| Role | Responsibilities |
|---|---|
| **Fleet Manager** | Oversees fleet assets, maintenance, vehicle lifecycle, and operational efficiency |
| **Driver** | Creates trips, assigns vehicles and drivers, monitors active deliveries |
| **Safety Officer** | Ensures driver compliance, tracks license validity, monitors safety scores |
| **Financial Analyst** | Reviews operational expenses, fuel consumption, maintenance costs, and profitability |

## ✨ Core Features

### Authentication & Access
- Secure email/password login
- Role-Based Access Control (RBAC)
- All routes protected — only authenticated users can access the app

### Dashboard
- KPIs: Active Vehicles, Available Vehicles, Vehicles in Maintenance, Active Trips, Pending Trips, Drivers On Duty, Fleet Utilization (%)
- Filters by vehicle type, status, and region

### Vehicle Registry
- Master list of vehicles: Registration Number (unique), Vehicle Name/Model, Type, Max Load Capacity, Odometer, Acquisition Cost
- Status: `Available` · `On Trip` · `In Shop` · `Retired`

### Driver Management
- Driver profiles: Name, License Number, License Category, License Expiry Date, Contact Number, Safety Score
- Status: `Available` · `On Trip` · `Off Duty` · `Suspended`

### Trip Management
- Create trips with source, destination, available vehicle, available driver, cargo weight, and planned distance
- Lifecycle: `Draft → Dispatched → Completed → Cancelled`

### Maintenance
- Create maintenance records per vehicle
- Adding an active maintenance log auto-switches vehicle status to `In Shop`, removing it from the driver's selection pool

### Fuel & Expense Management
- Log fuel entries (liters, cost, date) and other expenses (tolls, maintenance, etc.)
- Auto-computed total operational cost per vehicle (Fuel + Maintenance)

### Reports & Analytics
- Fuel Efficiency (Distance / Fuel)
- Fleet Utilization
- Operational Cost
- Vehicle ROI: `(Revenue − (Maintenance + Fuel)) / Acquisition Cost`
- CSV export (PDF export optional)

## 🔒 Mandatory Business Rules

- Vehicle registration number must be unique
- `Retired` or `In Shop` vehicles never appear in the dispatch selection
- Drivers with expired licenses or `Suspended` status cannot be assigned to trips
- A driver or vehicle already `On Trip` cannot be assigned to another trip
- Cargo weight must not exceed the vehicle's maximum load capacity
- Dispatching a trip auto-changes vehicle **and** driver status to `On Trip`
- Completing a trip auto-restores vehicle **and** driver status to `Available`
- Cancelling a dispatched trip restores vehicle and driver to `Available`
- Creating an active maintenance record auto-sets vehicle status to `In Shop`
- Closing maintenance restores vehicle to `Available` (unless retired)

## 🔁 Example Workflow

1. Register vehicle `Van-05` — max capacity 500 kg, status `Available`
2. Register driver `Alex` with a valid license
3. Create a trip with cargo weight = 450 kg
4. System validates 450 kg ≤ 500 kg → dispatch allowed
5. Vehicle and driver status auto-update to `On Trip`
6. Complete the trip — enter final odometer and fuel consumed
7. Vehicle and driver auto-revert to `Available`
8. Create a maintenance record (e.g. Oil Change) — vehicle auto-switches to `In Shop`, hidden from dispatch
9. Reports update operational cost and fuel efficiency based on the latest trip and fuel log

## 🗄️ Core Database Entities

`Users` · `Roles` · `Vehicles` · `Drivers` · `Trips` · `Maintenance Logs` · `Fuel Logs` · `Expenses`

## 🧰 Tech Stack

> Update this section once the stack is finalized — placeholder below reflects a typical MERN setup.

- **Frontend:** React (Vite), Tailwind CSS, Recharts (for KPI/analytics charts)
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Auth:** JWT-based auth with RBAC middleware
- **Deployment:** TBD

## 📦 Mandatory Deliverables

- [ ] Responsive web interface
- [ ] Authentication with RBAC
- [ ] CRUD for Vehicles and Drivers
- [ ] Trip Management with validations
- [ ] Automatic status transitions
- [ ] Maintenance workflow
- [ ] Fuel & Expense tracking
- [ ] Dashboard with KPIs
- [ ] Charts and visual analytics
- [ ] CSV export

## 🎁 Bonus Features (Stretch Goals)

- PDF export for reports
- Email reminders for expiring driver licenses
- Vehicle document management (uploads/attachments)
- Search, filters, and sorting across all list views
- Dark mode

## 🖼️ Mockup

Reference wireframe: [Excalidraw mockup](https://link.excalidraw.com/l/65VNwvy7c4X/1FHGDNgD2td)

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/shauryaverma03/TransitOps-Smart-Transport-Operations-Platform.git
cd TransitOps-Smart-Transport-Operations-Platform

# Backend setup
cd server
npm install
npm run dev

# Frontend setup
cd ../client
npm install
npm run dev
```

Environment variables needed (create a `.env` in `/server`):

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## 📁 Project Structure (suggested)

```
TransitOps/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
├── server/          # Node/Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── config/
└── README.md
```

## 📄 License

This project is currently unlicensed / private for hackathon submission purposes. Update this section as needed.

---

Built by [Shaurya Verma](https://shauryaverma.online) · [GitHub](https://github.com/shauryaverma03)
