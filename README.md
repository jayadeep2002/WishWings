# 🦋 WishWings: Bridge the Distance with Magic

WishWings is a premium MERN-stack platform designed to deliver unforgettable surprises to your loved ones, no matter where you are. From birthdays and anniversaries to "just because" moments, WishWings connects users, field agents, and magical experiences in real-time.

---

## 🚀 Getting Started

### 📦 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/YourUsername/WishWings.git
   cd WishWings
   ```

2. **Server Setup**
   ```bash
   cd server
   npm install
   # Create a .env file (see Environment Variables section)
   npm start
   ```

3. **Client Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the `/server` directory and configure the following:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

---

## 🎭 User Roles & Workflows

### 👤 1. Regular User (The Sender)
*   **Register/Login**: Secure OTP-based authentication.
*   **Browse Packages**: Explore curated surprises categorized by occasions.
*   **Book a Surprise**: Multi-step booking with secure payment simulation.
*   **Wishlist**: Save your favorite packages for later.
*   **Live Tracking**: Track the status of your assigned field agent.
*   **Memory Vault**: Unlock the "Vault" after completion to view photos/videos of the surprise captured by the agent.

### 🕵️ 2. Field Agent (The Executor)
*   **Registration**: Requires Admin approval to access missions.
*   **Mission Control**: View and manage assigned surprise deliveries.
*   **Real-time Updates**: Toggle status from "Agent Assigned" → "In Progress" → "Completed."
*   **Proof of Delivery**: Mandatory upload of 1–5 photos/videos of the reaction before marking a mission as accomplished.
*   **Profile**: Manage verification documents and performance ratings.

### 🛠️ 3. Master Admin (The Controller)
*   **Dashboard**: High-level overview of bookings, revenue, and active agents.
*   **Manage Agents**: Audit and approve/reject agent applications.
*   **Manage Bookings**: Manually assign agents to new user bookings.
*   **Catalog Management**: Create and edit Occasions and Packages.

---

## ✨ Features at a Glance

*   **Memory Vault**: A cinematic, glassmorphic UI for users to relive the moment.
*   **OTP Authentication**: Secure secondary verification for password resets.
*   **Dynamic Occasions**: 30+ pre-seeded occasion categories with dedicated packages.
*   **Cloud Media**: Seamless photo/video storage using Cloudinary (with local fallback).
*   **Responsive Design**: A stunning dark-themed UI with gold accents, optimized for all devices.

---

## 🛠️ Technology Stack

*   **Frontend**: React.js, Tailwind CSS, Framer Motion, Axios, React Icons.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Atlas).
*   **Authentication**: JWT & Session-based security.
*   **Media**: Multer & Cloudinary.

---

## 📜 Default Credentials (Testing)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@wishwings.in` | `Admin@123` |
| **Test User** | `user@test.com` | `User@123` |
| **Test Agent** | `agent@test.com` | `Agent@123` |

---

*Made with ❤️ by the WishWings Team*
