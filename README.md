# StockPulse — Real-Time Warehouse & Inventory Management System

![StockPulse warehouse](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80)

StockPulse is a modern, responsive, real-time inventory and warehouse stock control platform built using the **MERN pattern** (Node.js/Express backend + React frontend). It incorporates **Socket.IO** for instant multi-device synchronization, **Axios** with request interceptors for decoupled API communication, **JWT (JSON Web Tokens)** for stateless authentication, and **Role-Based Access Control (RBAC)** for operational permissions.

---

## 🚀 Key Features

- **Real-Time Stock Updates via Socket.IO:** Any stock movement (Stock In, Stock Out, Transfer, Quick Reorder) broadcasts immediately across all connected client stations without needing a page refresh.
- **Live Operational Log:** An automated audit trail updating in real time with event tags, timestamps, operator identity, and location.
- **Pixel-Accurate UI Design:** Implements the StockPulse tactile design system with soft semantic pill chips, 2×2 KPI metrics, and segmented inventory health gauges.
- **Interactive Barcode Scanner:** Simulated optical laser viewfinder for rapid SKU lookup and floor scan workflows.
- **Stock Movement Modal:** Dedicated flows for Inbound Receipt (Stock In), Dispatch / Pick (Stock Out), Inter-bay Transfers, and Physical Count Adjustments.
- **Catalog Management & Bottom Drawer:** Create, edit, inspect, and toggle catalog items with custom minimum alert thresholds.
- **JWT Authentication & Rapid Switch Presets:** Full auth cycle with login, registration, password strength metering, and one-tap role-switching presets (`Admin`, `Manager`, `Staff`).
- **Mobile & Desktop Responsive:** Bottom navigation on mobile devices and a docked navigation sidebar on desktop displays.

---

## 🛠️ Technology Stack & Role Breakdown

| Technology | Role & Contribution |
| :--- | :--- |
| **Node.js & Express** | Server runtime and backend RESTful API. Handles business logic, validates inventory constraints, and coordinates WebSocket broadcasts. |
| **Socket.IO** | Bi-directional event engine. Pushes `stock:updated`, `activity:new`, and `staff:online` events with low latency. |
| **React 19** | Component-driven frontend library using functional components, hooks, and React Context (`AuthContext`, `InventoryContext`). |
| **Axios** | HTTP client connecting frontend to backend. Uses central interceptors for injecting JWT `Bearer` headers and centralized error handling. |
| **JSON Web Tokens (JWT)** | Secure, stateless authentication. Encodes operator identity and user roles (`admin`, `manager`, `staff`) for API verification. |
| **Tailwind CSS v4** | Clean utility-first design system with custom color tokens, tactile curves (`rounded-3xl`), and responsive breakpoints. |
| **TypeScript** | End-to-end type safety across domain entities (`Product`, `ActivityLog`, `WarehouseStats`, `User`). |
| **Vite** | Modern build tool and dev server powering fast compilation and hot-reloading. |

---

## 🔄 How It Works

### 1. Real-Time Synchronization Flow

```text
[User Action: Stock In / Out / Reorder]
                 │
                 ▼
[Axios Client: POST /api/products/:id/movement (Bearer JWT)]
                 │
                 ▼
[Express Server: Validate Quantity & Update Store]
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
[HTTP Response: 200 OK]  [Socket.IO Server: broadcast('stock:updated')]
                            │
                            ▼
              [All Connected Warehouse Clients]
                            │
                            ▼
   - Update Product Stock Count
   - Transition Status Badge (Healthy ↔ Low Stock ↔ Depleted)
   - Prepend Entry to Live Operational Log
   - Show Instant Floating Toast Notification
```

### 2. Authentication & RBAC Flow

1. **User Login / Registration:** User enters credentials or selects a Rapid Switch Preset (`Admin`, `Manager`, `Staff`).
2. **Token Issuance:** Server validates credentials and returns a signed JWT containing user ID, name, email, and role.
3. **Persistent State:** Token is stored in `localStorage` and read by Axios interceptors for subsequent API requests.
4. **Role Enforcement:**
   - **Admin:** Full vault management, user management, and system configuration.
   - **Manager:** Stock approvals, procurement, vendor reorders, and catalog editing.
   - **Staff:** Floor scanning, barcode lookup, and physical stock in/out logging.

---

## 📂 Project Structure

```text
├── server.ts                 # Full-stack server entry (Express + Socket.IO + Vite middleware)
├── server/
│   ├── config/
│   │   └── db.ts              # In-memory document store & initial seed catalog
│   ├── controllers/
│   │   ├── authController.ts  # Login, register, current user, role switching
│   │   ├── productController.ts # Catalog CRUD, stock movements, quick reorders
│   │   ├── activityController.ts # Live operational log queries
│   │   └── statsController.ts # Aggregate KPI calculations & health breakdown
│   ├── middleware/
│   │   └── authMiddleware.ts  # JWT verification & request decoration
│   ├── routes/
│   │   ├── authRoutes.ts      # /api/auth endpoints
│   │   ├── productRoutes.ts   # /api/products endpoints
│   │   ├── activityRoutes.ts  # /api/activities endpoints
│   │   └── statsRoutes.ts     # /api/stats endpoints
│   └── socket/
│       └── socketHandler.ts   # Socket.IO connection handling & broadcast helpers
│
├── src/
│   ├── components/
│   │   ├── Header.tsx         # Top app bar with brand, role switcher & notification bell
│   │   ├── BottomNav.tsx      # Mobile navigation bar
│   │   ├── DesktopNav.tsx     # Desktop sidebar navigation & quick action dock
│   │   ├── DashboardView.tsx  # Overview dashboard matching Image 5
│   │   ├── ProductsView.tsx   # Catalog screen with filter chips matching Image 1
│   │   ├── AddProductModal.tsx # Bottom drawer modal for new products
│   │   ├── StockMovementModal.tsx # Stock In / Stock Out / Transfer modal
│   │   ├── BarcodeScannerModal.tsx # Optical barcode viewfinder simulator
│   │   ├── ProductDetailModal.tsx # SKU inspector & threshold progress bar
│   │   ├── InventoryMovementsView.tsx # Authoritative movement history
│   │   ├── ReportsView.tsx    # Inventory telemetry & category breakdown
│   │   ├── LoginScreen.tsx    # Authentication screen matching Image 3
│   │   ├── RegisterScreen.tsx # Account creation screen matching Image 7
│   │   ├── FacilityModal.tsx  # Active warehouse hub switcher
│   │   ├── NotificationsModal.tsx # Alert and event modal
│   │   └── UserProfileModal.tsx # Station terminal & operator details
│   ├── context/
│   │   ├── AuthContext.tsx    # User session, JWT tokens, RBAC state
│   │   └── InventoryContext.tsx # Live products, socket events, and operations
│   ├── services/
│   │   ├── api.ts             # Axios client with JWT request interceptor
│   │   └── socket.ts          # Socket.IO client instance and listener setup
│   ├── types/
│   │   └── index.ts           # Shared TypeScript interfaces
│   ├── App.tsx                # Main view router and provider wrapper
│   ├── main.tsx               # Client React DOM entry point
│   └── index.css              # Global Tailwind CSS and styling rules
│
├── index.html                 # HTML template with Inter font & Material Symbols
├── package.json               # Dependencies and build scripts
└── tsconfig.json              # TypeScript compiler configuration
```

---

## ⚡ Development & Scripts

### Install Dependencies

```bash
npm install
```

### Run Full-Stack Development Server

```bash
npm run dev
```

Starts the Express server with Socket.IO attached on `http://localhost:3000` while mounting Vite dev middleware.

### Build for Production

```bash
npm run build
```

### Type Checking & Linting

```bash
npm run lint
```

---

## 🔑 Demo Credentials

You can use the **Rapid Switch Testing** buttons on the Login screen, or enter:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `alex.admin@stockpulse.io` | `WarehousePass2025!` |
| **Manager** | `sarah.j@stockpulse.io` | `WarehousePass2025!` |
| **Staff** | `marcus.dock@stockpulse.io` | `WarehousePass2025!` |
