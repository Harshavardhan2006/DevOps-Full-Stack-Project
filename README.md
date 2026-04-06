# Student Resource Sharing Platform

A full-stack web application for students to share, discover, and rate academic resources. Built with a modern React frontend and a Node.js/Express backend, this project demonstrates DevOps best practices, CI/CD, and scalable architecture.

---

## 🚀 Features

- **Resource Hub:** Upload, download, and rate notes, assignments, and question papers.
- **Smart Search & Filters:** Find resources by subject, type, or popularity.
- **Community Ratings:** Rate and review resources to help others find the best content.
- **Admin Dashboard:** Manage users and resources with advanced controls.
- **Authentication:** Secure JWT-based login for students and admins.
- **Responsive UI:** Modern, mobile-friendly design using React and CSS.
- **DevOps Ready:** Includes GitHub Actions for CI/CD, containerization, and deployment automation.

---

## 🗂️ Project Structure

```
SudentResourcePlatform/
├── backend/         # Node.js/Express API
│   ├── config/      # DB config
│   ├── controllers/ # Route controllers
│   ├── middleware/  # Auth, upload, etc.
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API route definitions
│   ├── uploads/     # Uploaded files
│   └── server.js    # App entry point
├── frontend/        # React app
│   ├── public/      # Static assets
│   ├── src/
│   │   ├── components/ # Navbar, StarRating, etc.
│   │   ├── pages/      # Home, Login, Register, Admin, etc.
│   │   ├── services/   # API config
│   │   ├── styles/     # CSS
│   │   └── assets/     # Images
│   └── package.json
├── README.md
└── ...
```

---

## ⚙️ Backend (Node.js/Express)

- RESTful API for authentication, resource management, and admin operations
- MongoDB with Mongoose for data storage
- JWT authentication for secure access
- File uploads with Multer
- Modular controllers and middleware

**Key Endpoints:**

- `POST   /api/auth/register` — Register user
- `POST   /api/auth/login` — Login user
- `GET    /api/resources` — List all resources
- `POST   /api/resources/upload` — Upload resource (auth required)
- `POST   /api/resources/:id/rate` — Rate a resource
- `GET    /api/admin/users` — List all users (admin)
- `DELETE /api/admin/users/:id` — Delete user (admin)

---


## 💻 Frontend (React)

- Modern SPA using React, React Router, and Axios
- Pages: Landing, Home, Login, Register, Profile, Upload, Admin Dashboard
- Responsive design with custom CSS
- API integration with backend


---

## 🛠️ DevOps & CI/CD

- **GitHub Actions:** Automated build, test, and deploy pipelines
- **Jest:** Automated testing for backend and frontend
- **Containerization:** Docker-ready structure (add Dockerfile as needed)
- **Environment Variables:** Use `.env` files for secrets/config

---

## 📦 Dependencies

**Backend:**

- express, mongoose, bcryptjs, jsonwebtoken, multer, dotenv, cors, nodemon (dev)

**Frontend:**

- react, react-dom, react-router-dom, axios, @testing-library, web-vitals

---