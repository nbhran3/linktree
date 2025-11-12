import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 10;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: "localhost",
  database: "linktree_authentication",
  password: process.env.DB_PASS,
  port: 5432,
});

db.connect();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post("auth/register", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  if (existingUser.rows.length > 0) {
    return res.status(400).json({ error: "User already exists" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await db.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    );
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("auth/login", async (req, res) => {});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
