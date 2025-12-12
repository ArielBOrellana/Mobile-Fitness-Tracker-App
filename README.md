# Mobile Fitness Tracker App 🏋️‍♂️

A comprehensive mobile fitness tracking application built with React Native and Expo that helps users achieve their fitness goals through systematic workout tracking and progress visualization.

![React Native](https://img.shields.io/badge/React_Native-0.81.5-blue.svg)
![Expo](https://img.shields.io/badge/Expo-54.0.21-000020.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 📱 Overview

This app addresses the "Quantified Self" movement by helping users achieve their fitness goals through data-driven insights. Users can set monthly workout targets, track various exercise types, and visualize their progress through comprehensive analytics dashboards.

### Key Features

- 🎯 **Goal Setting**: Set personalized monthly workout targets
- 📊 **Progress Tracking**: Real-time progress visualization with statistics
- 💪 **Multiple Workout Types**: Strength, Running, Swimming, Stretching, Sports, Cycling
- 🔥 **Streak Tracking**: Monitor consecutive workout days
- 📈 **Analytics Dashboard**: 7-month trend visualization and workout breakdowns
- 🔍 **Advanced Search**: Filter workouts by type, intensity, duration, and date range
- 🔐 **Secure Authentication**: JWT-based user authentication
- ✅ **Comprehensive Testing**: Unit tests for frontend and backend components

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React Native 0.81.5
- Expo SDK 54
- Redux Toolkit (State Management)
- Expo Router (Navigation)
- React Native SVG (Visualizations)

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs (Password Hashing)

**Testing:**
- Jest
- React Native Testing Library
- 65%+ Code Coverage

## 📸 Screenshots

The app includes 7 main screens:
- **Sign In/Sign Up**: User authentication
- **Home Dashboard**: Overview with goal progress, streak, and recent workouts
- **Analytics**: Monthly trends and workout type breakdowns
- **Add Workout**: Comprehensive workout entry form
- **Search**: Advanced filtering and workout management
- **Profile**: User settings and goal configuration

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Expo CLI
- iOS Simulator or Android Emulator (or physical device with Expo Go)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/ArielBOrellana/Mobile-Fitness-Tracker-App.git
cd Mobile-Fitness-Tracker-App
```

2. **Install frontend dependencies:**
```bash
npm install
```

3. **Install backend dependencies:**
```bash
cd backend
npm install
```

4. **Configure environment variables:**

Create a `.env` file in the `backend/` directory:
```env
MONGO=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=your_secret_key_here
PORT=3000
```

For MongoDB Atlas, use your connection string:
```env
MONGO=mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker
```

5. **Start MongoDB (if running locally):**
```bash
mongod --dbpath /path/to/data
```

Or use MongoDB Atlas cloud database.

### Running the Application

1. **Start the backend server:**
```bash
cd backend
npm start
```

The server will run on `http://localhost:3000` (or your configured port).

2. **Start the frontend app:**

In the project root directory:
```bash
npm start
```

3. **Run on your device:**
- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: Scan the QR code with Expo Go app

**Important for physical devices**: Update the `API_URL` in the frontend to use your local IP address instead of localhost:
```javascript
// Example: 192.168.1.13:3000
const API_URL = "http://YOUR_LOCAL_IP:3000";
```

## 🧪 Testing

### Run Frontend Tests
```bash
npm test
```

### Run Backend Tests
```bash
cd backend
npm test
```

### Generate Coverage Reports
```bash
# Frontend coverage
npm run test:coverage

# Backend coverage
cd backend
npm run test:coverage
```

Coverage reports will be generated in `coverage/lcov-report/index.html`.
