# 🏠 Real Estate Platform API

A RESTful backend application built using **Node.js**, **Express**, and **PostgreSQL** for managing property listings, user authentication, and role-based access control.  
Includes full CRUD operations, JWT authentication, and **live Swagger documentation** hosted on Render.

---

## 🌐 Live Deployment

| Environment | URL |
|--------------|-----|
| **Live API Base URL** | [https://realtor-platform-saivamshim-backend.onrender.com/api](https://realtor-platform-saivamshim-backend.onrender.com/api) |
| **Swagger UI** | [https://realtor-platform-saivamshim-backend.onrender.com/api/docs](https://realtor-platform-saivamshim-backend.onrender.com/api/docs) |

 *Note:* This is deployed on **Render Free Plan**, so the API may take **20–30 seconds** to wake up after inactivity.

---

## 🚀 Features

- **Authentication**
  - User registration with roles: `owner`, `customer`, `admin`
  - Secure login with JWT token
  - Role-based route protection

- **Property Management**
  - Owners can create, update, delete their own properties
  - Public and customer users can browse properties
  - Search, filter, sort, and pagination support

- **User Management**
  - Admin-only routes to view all or single user details

- **Documentation**
  - Built-in Swagger UI for interactive API testing
  - JWT authorization available directly in Swagger (`Authorize 🔒` button)

---

## 🧩 Tech Stack

| Category | Technology |
|-----------|-------------|
| Language | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| Authentication | JWT (jsonwebtoken) |
| Password Security | bcryptjs |
| Documentation | Swagger UI |
| Environment | dotenv |

---

## 🎗️ Project Setup (Local Development)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/saivamshimuriki/realtor-platform-saivamshim-backend.git
cd realtor-platform-saivamshim-backend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root folder and add:
```env
PORT=3000
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=realestate
JWT_SECRET=mysecretkey
```

### 4️⃣ Configure Database

Run the following in `psql` or `pgAdmin`:

```sql
CREATE DATABASE realestate;

\c realestate

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(200),
  role VARCHAR(20) CHECK (role IN ('owner','customer','admin'))
);

CREATE TABLE properties(
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  price NUMERIC,
  location VARCHAR(100),
  bedrooms INT,
  bathrooms INT,
  area NUMERIC,
  property_type VARCHAR(50),
  listing_type VARCHAR(50),
  images TEXT[],
  owner_id INT REFERENCES users(id)
);
```

---

## ▶️ Run the Server Locally

```bash
npm start
```

Visit:
```
http://localhost:3000/api/docs
```

✅ You should see the **Swagger UI** running locally.

---

## 🔐 Authentication Flow

### Register a User
**POST** `/api/auth/register`
```json
{
  "username": "owner1",
  "password": "12345",
  "role": "owner"
}
```

### Login and Get Token
**POST** `/api/auth/login`
```json
{
  "username": "owner1",
  "password": "12345"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

Use this token for secured requests:
```
Authorization: Bearer <token>
```

---

## 🏡 Property Endpoints

| Method | Endpoint | Description | Auth Required |
|---------|-----------|--------------|----------------|
| `POST` | `/api/properties` | Create new property | Owner |
| `GET` | `/api/properties` | Get all properties (with filters/pagination) | Public |
| `GET` | `/api/properties/:id` | Get single property | Public |
| `PUT` | `/api/properties/:id` | Update own property | Owner |
| `DELETE` | `/api/properties/:id` | Delete own property | Owner |

### Example Filter
```
GET /api/properties?location=Downtown&minPrice=200000&maxPrice=500000&sortBy=price_desc&page=2
```

---

## 👥 User Endpoints (Admin Only)

| Method | Endpoint | Description | Role |
|---------|-----------|-------------|------|
| `GET` | `/api/users` | Get all users | Admin |
| `GET` | `/api/users/:id` | Get single user by ID | Admin |

---

## 📘 API Documentation (Swagger UI)

### 🔗 Local
```
http://localhost:3000/api/docs
```

### 🔗 Render (Live)
```
https://realtor-platform-saivamshim-backend.onrender.com/api/docs
```

You can:
- View all endpoints
- Authenticate via JWT in Swagger (`Authorize` button)
- Test requests live against either:
  - Localhost (for development)
  - Render deployment (for live testing)

---

## 🧠 Role Behavior

| Role | Permissions |
|------|--------------|
| **Owner** | Create, update, delete own properties |
| **Customer** | Browse listings, view limited owner contact |
| **Admin** | Manage users, view all data |

---

## 🗂 Folder Structure

```
realtor-platform-saivamshim-backend/
│
├── routes/
│   ├── authRoutes.js
│   ├── propertyRoutes.js
│   └── userRoutes.js
│
├── models/          # Optional model definitions
├── db.js            # PostgreSQL connection logic
├── index.js         # Main server file
├── swagger.json     # Swagger config with live + local servers
├── .env.example     # Sample environment file
└── package.json
```

---

## 🥪 Testing Workflow

1️⃣ **Register** new users  
2️⃣ **Login** → copy the JWT token  
3️⃣ **Authorize** in Swagger  
4️⃣ **Create** or **fetch** properties  
5️⃣ **Verify** data in DB or via `/api/properties`  

---

## 💾 Deployment Notes

- Hosted on **Render** Free Tier
  - Sleeps after ~15 min of inactivity
  - Wakes automatically on next request
- Database: **Render PostgreSQL**
- Default Port: `10000` (Render) or `3000` (Local)
- To deploy yourself:
  1. Fork this repo  
  2. Push to GitHub  
  3. Deploy via [Render.com](https://render.com)

---

## 🏁 Author
**Sai vamshi Muriki**  
📧 saivamshimuriki@gmail.com  
💼 [GitHub Profile](https://github.com/saivamshimuriki)  
🌍 [Live API on Render](https://realtor-platform-saivamshim-backend.onrender.com/api/docs)

---

