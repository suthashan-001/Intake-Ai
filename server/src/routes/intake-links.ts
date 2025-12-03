// Intake Link Routes

// These routes handle creating and managing intake links for the "Invite Patient" - button feature
// When a doctor wants a patient to fill out an intake form, they create an intake link

import { Router, Request, Response, NextFunction } from "express";
import crypto from "crypto";
import prisma from "../lib/prisma";
import { ApiResponse } from "../types";
import authMiddleware from "../middleware/auth";

// Create the router for intake link routes
const router = Router();

router.use(authMiddleware);

// Frontend URL for building the intake link
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ============================================
// POST /api/intake-links
// Create a new intake link for a patient
// ============================================
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get userId from the JWT token
    const userId = req.userId!;
    const { patientId, expiresInDays = 7 } = req.body;

    // Validate patientId is provided
    if (!patientId) {
      const response: ApiResponse<null> = {
        success: false,
        error: "patientId is required",
      };
      return res.status(400).json(response);
    }

    // Check if the patient exists and belongs to this doctor
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Patient not found",
      };
      return res.status(404).json(response);
    }

    if (patient.userId !== userId) {
      const response: ApiResponse<null> = {
        success: false,
        error: "You don't have permission to create a link for this patient",
      };
      return res.status(403).json(response);
    }

    // Generate a unique token using crypto
    // This creates a random 32-byte hex string (64 characters)
    const token = crypto.randomBytes(32).toString("hex");

    // Calculate expiration date (default: 7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Create the intake link in the database
    const intakeLink = await prisma.intakeLink.create({
      data: {
        token: token,
        expiresAt: expiresAt,
        patientId: patientId,
      },
      // Include patient info in the response
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Build the full URL that the patient will use
    const url = `${FRONTEND_URL}/intake/${token}`;

    // Return the intake link with the URL
    const response: ApiResponse<typeof intakeLink & { url: string }> = {
      success: true,
      data: {
        ...intakeLink,
        url: url,
      },
      message: "Intake link created successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// ============================================
// GET /api/intake-links
// List all intake links for the logged-in doctor's patients
// ============================================
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get userId from the JWT token
    const userId = req.userId!;

    // Get all intake links for patients that belong to this doctor
    const intakeLinks = await prisma.intakeLink.findMany({
      where: {
        patient: {
          userId: userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Add status info to each link (expired, used, or active)
    const now = new Date();
    const linksWithStatus = intakeLinks.map((link) => {
      let status: "expired" | "used" | "active";

      if (link.isUsed) {
        status = "used";
      } else if (link.expiresAt < now) {
        status = "expired";
      } else {
        status = "active";
      }

      return {
        ...link,
        status: status,
        url: `${FRONTEND_URL}/intake/${link.token}`,
      };
    });

    const response: ApiResponse<typeof linksWithStatus> = {
      success: true,
      data: linksWithStatus,
      message: `Found ${linksWithStatus.length} intake links`,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// ============================================
// GET /api/intake-links/:id
// Get a single intake link by ID
// ============================================
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Get userId from the JWT token
    const userId = req.userId!;

    // Find the intake link
    const intakeLink = await prisma.intakeLink.findUnique({
      where: { id: id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userId: true,
          },
        },
        intake: true, // Include the intake if one was created
      },
    });

    if (!intakeLink) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Intake link not found",
      };
      return res.status(404).json(response);
    }

    // Check if this link belongs to the logged-in doctor's patient
    if (intakeLink.patient.userId !== userId) {
      const response: ApiResponse<null> = {
        success: false,
        error: "You don't have permission to view this intake link",
      };
      return res.status(403).json(response);
    }

    // Determine status
    const now = new Date();
    let status: "expired" | "used" | "active";

    if (intakeLink.isUsed) {
      status = "used";
    } else if (intakeLink.expiresAt < now) {
      status = "expired";
    } else {
      status = "active";
    }

    const response: ApiResponse<
      typeof intakeLink & { status: string; url: string }
    > = {
      success: true,
      data: {
        ...intakeLink,
        status: status,
        url: `${FRONTEND_URL}/intake/${intakeLink.token}`,
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// ============================================
// DELETE /api/intake-links/:id
// Delete/revoke an intake link
// ============================================
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      // Get userId from the JWT token
      const userId = req.userId!;

      // Find the intake link first to check permissions
      const intakeLink = await prisma.intakeLink.findUnique({
        where: { id: id },
        include: {
          patient: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (!intakeLink) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Intake link not found",
        };
        return res.status(404).json(response);
      }

      // Check if this link belongs to the logged-in doctor's patient
      if (intakeLink.patient.userId !== userId) {
        const response: ApiResponse<null> = {
          success: false,
          error: "You don't have permission to delete this intake link",
        };
        return res.status(403).json(response);
      }

      // Delete the intake link
      await prisma.intakeLink.delete({
        where: { id: id },
      });

      const response: ApiResponse<null> = {
        success: true,
        message: "Intake link deleted successfully",
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
