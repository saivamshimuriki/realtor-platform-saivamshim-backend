import express from "express";
import pool from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// 🔒 Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// 🏠 CREATE property (owner only)
router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "owner")
      return res.status(403).json({ error: "Only owners can add properties" });

    const { title, description, price, location, bedrooms, bathrooms, area, property_type, listing_type, images } = req.body;

    const result = await pool.query(
      `INSERT INTO properties (title, description, price, location, bedrooms, bathrooms, area, property_type, listing_type, images, owner_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [title, description, price, location, bedrooms, bathrooms, area, property_type, listing_type, images || [], req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📖 GET all properties with filters + pagination
router.get("/", async (req, res) => {
  try {
    const { location, minPrice, maxPrice, type, sortBy, page = 1, limit = 5 } = req.query;

    let query = "SELECT * FROM properties WHERE 1=1";
    const params = [];

    // Filters
    if (location) {
      params.push(`%${location}%`);
      query += ` AND location ILIKE $${params.length}`;
    }
    if (minPrice) {
      params.push(minPrice);
      query += ` AND price >= $${params.length}`;
    }
    if (maxPrice) {
      params.push(maxPrice);
      query += ` AND price <= $${params.length}`;
    }
    if (type) {
      params.push(type);
      query += ` AND property_type ILIKE $${params.length}`;
    }

    // Sorting
    if (sortBy === "price_asc") query += " ORDER BY price ASC";
    else if (sortBy === "price_desc") query += " ORDER BY price DESC";
    else query += " ORDER BY id DESC";

    // Pagination
    const offset = (page - 1) * limit;
    params.push(limit, offset);
    query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

    // Total count for front-end
    const totalResult = await pool.query("SELECT COUNT(*) FROM properties");
    const result = await pool.query(query, params);

    res.json({
      page: Number(page),
      limit: Number(limit),
      total: Number(totalResult.rows[0].count),
      results: result.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✏️ UPDATE property (only if owner owns it)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;

    const property = await pool.query("SELECT * FROM properties WHERE id=$1", [id]);
    if (!property.rows.length) return res.status(404).json({ error: "Property not found" });

    if (property.rows[0].owner_id !== req.user.id)
      return res.status(403).json({ error: "You can only update your own property" });

    const updated = await pool.query(
      "UPDATE properties SET title=$1, description=$2, price=$3 WHERE id=$4 RETURNING *",
      [title, description, price, id]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ DELETE property (only if owner owns it)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const property = await pool.query("SELECT * FROM properties WHERE id=$1", [id]);
    if (!property.rows.length) return res.status(404).json({ error: "Property not found" });

    if (property.rows[0].owner_id !== req.user.id)
      return res.status(403).json({ error: "You can only delete your own property" });

    await pool.query("DELETE FROM properties WHERE id=$1", [id]);
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    let role = "guest";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        role = decoded.role;
      } catch {
        role = "guest";
      }
    }

    const result = await pool.query(
      `SELECT p.*, u.username AS owner_username
       FROM properties p
       JOIN users u ON p.owner_id = u.id
       WHERE p.id = $1`,
      [id]
    );
    console.log("🔍 SQL Result:", result.rows);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Property not found" });

    const property = result.rows[0];

    // Show owner only to customers
    if (role !== "customer") {
      delete property.owner_username;
    }

    // res.status(200).json(property);
    res.json(property);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});



export default router;
