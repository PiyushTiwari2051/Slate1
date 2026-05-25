# TaskFlow — Premium MERN Todo Application

TaskFlow is a production-grade, full-stack TODO Application built using the MERN stack (MongoDB + Express.js + React.js + Node.js) with secure verification states, JWT auth routing, and a dark Obsidian Craft aesthetic.

## ✨ Core Features
- **OTP-based Verification**: Identity checking via Nodemailer ( console fallback mode supported).
- **JWT-Protected Route Management**: Bearer token session protection with 7-day expiration.
- **Obsidian Dark & Light Theme**: Toggle between Obsidian Dark mode and Moleskine warm paper Light mode.
- **Advanced CRUD**: Title, description, due date picker, priority tag toggles, status pills, and full pagination.
- **Search & Sort**: Debounced search bar with sorting (dueDate, priority, title, createdAt) and ordering (asc/desc).
- **Soft Deletion**: Mongoose pre-hook filters out `isDeleted` records for data resilience and easy recovery.
- **Rate-Limiting & Protection**: Strict security headers (Helmet), brute-force limiter (10 attempts per 15 mins), NoSQL sanitization (mongo-sanitize), and input payload limits.
- **Animations & Micro-interactions**: Page entrance offsets, card completions with canvas-confetti bursts, shaking inputs on error, and accordion form slides.

---

## 🚀 Tech Stack
- **Frontend**: React 19 + Vite + Tailwind CSS + Lucide icons + Canvas Confetti
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Mail**: Nodemailer SMTP

---

## 🏃 Local Setup Instructions

### Prerequisites
- **Node.js** v18+
- **MongoDB** local community server (port `27017`) or MongoDB Atlas URI

### Installation

1. **Clone/Open the repository:**
   ```bash
   cd To-do
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```
   - Create a `.env` file in the `server` directory (matching the variables in `.env.example`):
     ```env
     PORT=5000
     NODE_ENV=development
     CLIENT_URL=http://localhost:5173
     MONGODB_URI=mongodb://localhost:27017/taskflow
     JWT_SECRET=specify_a_strong_secret_key_minimum_32_characters
     JWT_EXPIRES_IN=7d
     
     # Optional: SMTP Email configuration (If omitted, runs in console fallback mode)
     # EMAIL_HOST=smtp.gmail.com
     # EMAIL_PORT=587
     # EMAIL_USER=your_email@gmail.com
     # EMAIL_PASS=your_gmail_app_password
     ```
   - Start the server:
     ```bash
     npm run dev
     ```
     *(Note: If SMTP credentials are not set, the server prints incoming OTP verification codes directly to the terminal for easy copy-pasting during registration).*

3. **Frontend Setup:**
   ```bash
   cd ../client
   npm install
   ```
   - Create a `.env` file in the `client` directory (matching `.env.example`):
     ```env
     VITE_API_URL=/api
     ```
   - Run the client development server:
     ```bash
     npm run dev
     ```
   - Open your browser to `http://localhost:5173`.

---

## 🔑 Keyboard Shortcuts
- **Press `N`**: Open/Expand the Task Creator Accordion form (when not focusing input).
- **Press `/`**: Focus the search input field instantly.
- **Press `ESC`**: Close modals, cancel creation forms, or close confirm boxes.

---

## 🔒 Security Implementations Checkoff
- [x] **Password hashing**: Hashed with bcrypt (12 rounds) on pre-save.
- [x] **OTP Encryption**: Encrypted with SHA-256 before database storage.
- [x] **OTP Brute-force block**: Maximum 5 incorrect verification attempts.
- [x] **OTP Expiry**: Expires in 10 minutes.
- [x] **Protected API**: Middlewares reject invalid or expired bearer tokens.
- [x] **NoSQL Injection Block**: express-mongo-sanitize filters query properties.
- [x] **Rate Limiters**: Stricter endpoint limiting on auth (10 per 15 min) than global endpoints.
- [x] **JSON payload limits**: Payload limits set at 10kb to block memory exhaustion.
