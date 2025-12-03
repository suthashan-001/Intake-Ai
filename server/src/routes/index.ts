// Main Routes File

import { Router } from "express";
import authRoutes from "./auth";
import patientRoutes from "./patients";
import intakeLinkRoutes from "./intake-links";
import publicIntakeRoutes from "./public-intake";
import intakeRoutes from "./summaries";

// Create the main router
const router = Router();

// Health check endpoint
// GET /api/health
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "IntakeAI API is running",
    timestamp: new Date().toISOString(),
  });
});

//public Auth routes - Login, register, logout, token refresh
router.use("/auth", authRoutes);

// Patient routes - requires auth
router.use("/patients", patientRoutes);

// Intake link routes - Create and manage intake links for "Invite Patient" feature
router.use("/intake-links", intakeLinkRoutes);

// Public intake routes - Patient-facing endpoints
// These are accessed via the unique token in the URL
router.use("/public/intake", publicIntakeRoutes);

// Intake routes - View intakes and generate AI summaries
router.use("/intakes", intakeRoutes);

export default router;
