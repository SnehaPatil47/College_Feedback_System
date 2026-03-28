# 🎓 EduPulse – College Feedback Management System
### Full Stack MERN Application

A modern, production-ready College Feedback System built with **MongoDB, Express, React, Node.js**.

---

## 📁 Project Structure

```
college-feedback/
├── backend/          # Express + MongoDB API
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── middleware/   # JWT auth middleware
│   ├── server.js     # Entry point
│   ├── seed.js       # Database seeder
│   └── .env          # Environment variables
└── frontend/         # React application
    └── src/
        ├── pages/    # All page components
        ├── components/ # Reusable components
        └── context/  # Auth context
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+
- **MongoDB** (local or [MongoDB Atlas](https://cloud.mongodb.com))
- **npm** or **yarn**

---

### Step 1 – Start MongoDB

**Local:**
```bash
mongod
```
**Or use MongoDB Atlas** – update `MONGO_URI` in `backend/.env`

---

### Step 2 – Backend Setup

```bash
cd backend
npm install
npm run seed        # Populate demo data
npm run dev         # Start on http://localhost:5000
```

---

### Step 3 – Frontend Setup

```bash
cd frontend
npm install
npm start           # Opens http://localhost:3000
```

---

## 🔑 Demo Credentials

| Role        | Email                          | Password     |
|-------------|--------------------------------|--------------|
| Admin       | admin@college.edu              | password123  |
| Coordinator | coordinator@college.edu        | password123  |
| Faculty     | priya@college.edu              | password123  |
| Student     | arjun@student.college.edu      | password123  |

---

## ✨ Features

### 🛡️ Admin
- Dashboard with real-time analytics (charts, stats)
- Manage students and faculty (CRUD)
- Manage courses and assignments
- View all feedback reports with status management
- Filter by semester, batch, department

### 👨‍🏫 Faculty
- View feedback for their courses
- Filter by course, batch, semester
- Performance radar chart and bar chart
- Anonymous vs. named feedback view

### 🎓 Student
- Multi-step feedback submission wizard
- 5-criteria star rating system
- Anonymous submission option
- Feedback completion tracker
- History of submitted feedbacks

### 📋 Coordinator
- Department performance overview
- Manage course assignments
- View and update feedback status
- Summary analytics

---

## 🛠️ Tech Stack

| Layer      | Technology                     |
|------------|-------------------------------|
| Frontend   | React 18, React Router v6     |
| Styling    | Custom CSS variables, Poppins/Inter fonts |
| Charts     | Chart.js + react-chartjs-2    |
| Backend    | Node.js + Express.js          |
| Database   | MongoDB + Mongoose            |
| Auth       | JWT + bcryptjs                |
| Toasts     | react-hot-toast               |

---

## 🌐 API Endpoints

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| POST   | /api/auth/login           | Login                    |
| POST   | /api/auth/register        | Register user            |
| GET    | /api/auth/me              | Get current user         |
| PUT    | /api/auth/updatepassword  | Update password          |
| GET    | /api/users                | List users (admin)       |
| POST   | /api/users                | Create user (admin)      |
| GET    | /api/courses              | List courses             |
| POST   | /api/courses              | Create course            |
| POST   | /api/feedback             | Submit feedback          |
| GET    | /api/feedback/my          | My feedbacks             |
| GET    | /api/feedback/faculty     | Faculty feedbacks        |
| GET    | /api/feedback/all         | All feedbacks            |
| GET    | /api/feedback/analytics   | Analytics data           |
| GET    | /api/stats/overview       | Dashboard stats          |

---

## 🔧 Environment Variables (backend/.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/college_feedback
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## 📦 Build for Production

```bash
# Frontend
cd frontend && npm run build

# Serve with Express (add to server.js)
app.use(express.static(path.join(__dirname, '../frontend/build')));
```
