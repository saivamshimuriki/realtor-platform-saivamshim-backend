import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";



dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);
// ✅ Swagger setup
const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));




// ✅ Test database connection once at startup
pool.query("SELECT NOW()").then((res) => console.log("DB Connected:", res.rows[0].now));

// 🔐 Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Real Estate API is running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
