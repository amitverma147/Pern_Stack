import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

//implementing the rate limiter middleware
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });
    console.log(decision);
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ message: "Too many requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ message: "Bots are not allowed" });
      } else {
        res.status(403).json({ message: "Forbidden" });
      }

      return;
    }

    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      res.status(403).json({ message: "Spoofed bots are not allowed" });
      return;
    }
    next();
  } catch (error) {}
});

app.use("/api/products", productRoutes);

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      image VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log("Connected to DB");
  } catch (error) {
    console.error("Error while connecting to DB:", error);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
