# TransitOps — Smart Transport Operations Platform

A centralized transport operations platform that digitizes vehicle, driver, dispatch, maintenance, and expense management. Built for logistics companies to enforce strict business rules server-side and provide operational insights via a dashboard.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v16.0.0 or higher recommended)
- **npm** (comes with Node.js)
- **MongoDB** (running locally on default port `27017`)

---

## 🚀 How to Run the Project Locally

Because this is a full-stack application, you need to run both the Backend (Server) and Frontend (Client) at the same time in separate terminal windows.

### Step 1: Start the Backend Server

1. Open a new terminal window.
2. Navigate into the `server` directory:
   ```bash
   cd server
   ```
3. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
4. Seed the database with demo data (run this only once):
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
   *You should see a message saying `🚀 TransitOps API running on port 5001` and `✅ MongoDB Connected: localhost`.*

### Step 2: Start the Frontend Client

1. Open a **second, new terminal window** (keep the server running in the first one).
2. Navigate into the `client` directory:
   ```bash
   cd client
   ```
3. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to the local URL provided (usually **`http://localhost:5173`**).

---

## 🧪 Testing with Demo Accounts

The database seed script created 4 demo accounts for you to test the Role-Based Access Control (RBAC). On the login page, you can simply click the **Demo Accounts** buttons to auto-fill the credentials, or use the following manually:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Fleet Manager** | `fleet@transitops.com` | `password123` | Full Access (Vehicles, Maintenance, Settings, etc.) |
| **Dispatcher** | `dispatch@transitops.com` | `password123` | Fleet, Drivers, and Trip Management |
| **Safety Officer** | `safety@transitops.com` | `password123` | Drivers, Analytics, Dashboard |
| **Financial Analyst**| `finance@transitops.com` | `password123` | Fuel, Expenses, and Analytics |

---

## Tech Stack
- **Backend:** Node.js, Express, MongoDB, Mongoose, JSON Web Tokens (JWT)
- **Frontend:** React, Vite, Tailwind CSS v3, Recharts, Axios, Lucide React
