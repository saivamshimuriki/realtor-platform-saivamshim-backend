# 🏠 Real Estate Platform API

A RESTful backend application built using **Node.js**, **Express**, and **PostgreSQL** for managing property listings, user authentication, and role-based access control.  
Includes full CRUD operations, JWT authentication, and Swagger documentation.

---

## 🚀 Features

- **Authentication**
  - User registration with role: `owner`, `customer`, `admin`
  - Secure login with JWT token
  - Role-based route protection

- **Property Management**
  - Owners can create, update, delete their own properties
  - Public (guest) and customer users can browse all properties
  - Filters: location, price range, property type, sorting

- **User Management**
  - Admin-only access to view all users or single user details

- **Documentation**
  - Interactive Swagger UI for API testing
  - JWT authorization built-in to Swagger

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

## 🏗️ Project Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/real-estate-platform.git
cd real-estate-platform
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

Open `psql` or pgAdmin and run:

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

## ▶️ Run the Server

Start your local development server:
```bash
npm start
```

Visit:
```
http://localhost:3000/
```

✅ You should see:  
`Real Estate API is running 🚀`

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

Use this token in your requests as:
```
Authorization: Bearer <token>
```

---

## 🏡 Property Endpoints

| Method | Endpoint | Description | Auth Required |
|---------|-----------|--------------|----------------|
| `POST` | `/api/properties` | Create new property | Owner |
| `GET` | `/api/properties` | Get all properties (with filters) | Public |
| `GET` | `/api/properties/:id` | Get single property | Public |
| `PUT` | `/api/properties/:id` | Update own property | Owner |
| `DELETE` | `/api/properties/:id` | Delete own property | Owner |

### Example Filter
```
GET /api/properties?location=Downtown&minPrice=200000&maxPrice=500000&sortBy=price_desc
```

---

## 👥 User Endpoints (Admin Only)

| Method | Endpoint | Description | Role |
|---------|-----------|-------------|------|
| `GET` | `/api/users` | Get all users | Admin |
| `GET` | `/api/users/:id` | Get user by ID | Admin |

---

## 📘 API Documentation (Swagger UI)

Once the server is running, visit:
```
http://localhost:3000/api/docs
```

There you can:
- View all API endpoints  
- Authenticate using JWT via the **Authorize 🔒 button**  
- Test routes directly inside your browser

---

## 🧠 Example Roles and Behavior

| Role | Permissions |
|------|--------------|
| **Owner** | Create, update, delete own properties |
| **Customer** | View properties, view owner contact |
| **Admin** | Manage users, view all data |

---

## 📦 Folder Structure

```
real-estate-platform/
│
├── routes/
│   ├── authRoutes.js
│   ├── propertyRoutes.js
│   └── userRoutes.js
│
├── models/          # (Optional - for schema separation)
├── db.js            # PostgreSQL connection
├── index.js         # Main server entry
├── swagger.json     # Swagger configuration
├── .env             # Environment variables
└── package.json
```

---

## 🧪 Example Testing Order

1️⃣ Register → 2️⃣ Login → 3️⃣ Copy Token → 4️⃣ Authorize in Swagger → 5️⃣ Test CRUD  

---

## 💾 Deployment Notes (Optional)
You can host this on:
- **Render** / **Railway** / **Vercel (Server)** for backend  
- Connect PostgreSQL via **Neon**, **Supabase**, or **ElephantSQL**

---

## 🏁 Author
**Your Name Here**  
📧 your.email@example.com  
💼 [GitHub Profile](https://github.com/<your-username>)

---
