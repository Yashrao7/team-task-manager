# Team Task Manager

A full-stack project management application designed for teams to collaborate on projects and track tasks efficiently. Built with the modern MERN-like stack (React, Express, Prisma, PostgreSQL).

## 🚀 Live Demo
- **Frontend:** [https://team-task-manager-production-dee8.up.railway.app](https://team-task-manager-production-dee8.up.railway.app)
- **Backend API:** [https://team-task-manager-production-a5a9.up.railway.app](https://team-task-manager-production-a5a9.up.railway.app)

## ✨ Features
- **User Authentication:** Secure Signup and Login using JWT and Bcrypt.
- **Project Management:** Create, view, and manage multiple projects.
- **Task Tracking:** Add tasks to projects, set due dates, and track status (Pending, In Progress, Completed).
- **Team Collaboration:** Assign tasks to specific team members.
- **Responsive UI:** Fully responsive design built with Tailwind CSS 4 and Lucide icons.

## 🛠️ Tech Stack
### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS 4
- **Navigation:** React Router 7
- **Icons:** Lucide React
- **State/API:** Axios & React Hooks

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **ORM:** Prisma
- **Database:** PostgreSQL (deployed on Railway)
- **Security:** JSON Web Tokens (JWT) & Bcrypt password hashing

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL database (or use the provided Prisma setup)

### 1. Clone the repository
```bash
git clone https://github.com/Yashrao7/team-task-manager.git
cd team-task-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` folder:
```env
DATABASE_URL="your_postgresql_url"
JWT_SECRET="your_secret_key"
PORT=5000
```
- Initialize the database:
```bash
npx prisma db push
```
- Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
- Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL="http://localhost:5000/api"
```
- Start the development server:
```bash
npm run dev
```

## 🚢 Deployment (Railway)
This project is configured for deployment on Railway.
1. Create two separate services (one for `frontend`, one for `backend`).
2. **Backend:** Set `DATABASE_URL` and `JWT_SECRET` in environment variables.
3. **Frontend:** 
   - Set the `VITE_API_URL` variable to your Backend URL.
   - Set the port to `5173`.
   - Update `vite.config.js` to allow the railway host.

## 📄 License
This project is licensed under the ISC License.
