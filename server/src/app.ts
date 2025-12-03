// Express App Setup

import express from "express";
import cors from "cors";
import routes from "./routes";
import errorHandler from "./middleware/errorHandler";

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:3000", // Alternative dev port
  "http://localhost",
  process.env.FRONTEND_URL, // in env file
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// for form submissions: Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

// 404 handler - when no route matches
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Global error handler - catches all errors
app.use(errorHandler);

export default app;
