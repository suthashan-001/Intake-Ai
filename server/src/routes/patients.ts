// Patient Routes

import { Router, Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { ApiResponse } from "../types";
import {
  validateCreatePatient,
  validateUpdatePatient,
  CreatePatientInput,
} from "../validators/patient";
import authMiddleware from "../middleware/auth";

// Create the router for patient routes
const router = Router();

// Apply auth middleware to ALL routes in this file - every route requires a valid auth
router.use(authMiddleware);

// ============================================
// GET /api/patients
// Get all patients for the logged-in doctor
// ============================================
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get userId from the JWT token (set by authMiddleware)
    const userId = req.userId!;

    // Fetch all patients that belong to this doctor
    const patients = await prisma.patient.findMany({
      where: {
        userId: userId,
      },
      // Sort by most recently created first
      orderBy: {
        createdAt: "desc",
      },
      // Include count of intakes and appointments for each patient
      include: {
        _count: {
          select: {
            intakes: true,
            appointments: true,
          },
        },
      },
    });

    // Return the list of patients
    const response: ApiResponse<typeof patients> = {
      success: true,
      data: patients,
      message: `Found ${patients.length} patients`,
    };

    res.json(response);
  } catch (error) {
    // Pass error to the global error handler
    next(error);
  }
});

// ============================================
// GET /api/patients/:id
// Get a single patient by ID with their intakes and appointments
// ============================================
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Get userId from the JWT token
    const userId = req.userId!;

    // Find the patient by ID
    // Also include their intakes (with summaries) and appointments
    const patient = await prisma.patient.findUnique({
      where: {
        id: id,
      },
      include: {
        // Include all intakes for this patient
        intakes: {
          orderBy: { createdAt: "desc" },
          include: {
            // Include the AI summary for each intake
            summary: true,
          },
        },
        // Include all appointments for this patient
        appointments: {
          orderBy: { scheduledAt: "desc" },
        },
        // Include intake links
        intakeLinks: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Check if patient exists
    if (!patient) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Patient not found",
      };
      return res.status(404).json(response);
    }

    // Check if this patient belongs to the logged-in doctor
    // This prevents doctors from seeing other doctors' patients
    if (patient.userId !== userId) {
      const response: ApiResponse<null> = {
        success: false,
        error: "You don't have permission to view this patient",
      };
      return res.status(403).json(response);
    }

    // Return the patient data
    const response: ApiResponse<typeof patient> = {
      success: true,
      data: patient,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// ============================================
// POST /api/patients
// Create a new patient
// ============================================
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get userId from the JWT token
    const userId = req.userId!;

    // Validate the request body
    const validation = validateCreatePatient(req.body);

    if (!validation.isValid) {
      const response: ApiResponse<null> = {
        success: false,
        error: validation.errors.join(", "),
      };
      return res.status(400).json(response);
    }

    // Extract data from request body
    const { firstName, lastName, email, phone, dateOfBirth } =
      req.body as CreatePatientInput;

    // Create the new patient in the database
    const newPatient = await prisma.patient.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        userId: userId, // Link to the logged-in doctor
      },
    });

    // Return the created patient
    const response: ApiResponse<typeof newPatient> = {
      success: true,
      data: newPatient,
      message: "Patient created successfully",
    };

    // 201 = Created
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// ============================================
// PUT /api/patients/:id
// Update an existing patient
// ============================================
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Get userId from the JWT token
    const userId = req.userId!;

    // Validate the request body
    const validation = validateUpdatePatient(req.body);

    if (!validation.isValid) {
      const response: ApiResponse<null> = {
        success: false,
        error: validation.errors.join(", "),
      };
      return res.status(400).json(response);
    }

    // First, check if the patient exists and belongs to this doctor
    const existingPatient = await prisma.patient.findUnique({
      where: { id: id },
    });

    if (!existingPatient) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Patient not found",
      };
      return res.status(404).json(response);
    }

    if (existingPatient.userId !== userId) {
      const response: ApiResponse<null> = {
        success: false,
        error: "You don't have permission to update this patient",
      };
      return res.status(403).json(response);
    }

    // Build the update data object
    // Only include fields that were provided in the request
    const { firstName, lastName, email, phone, dateOfBirth } = req.body;

    const updateData: Record<string, unknown> = {};

    if (firstName !== undefined) updateData.firstName = firstName.trim();
    if (lastName !== undefined) updateData.lastName = lastName.trim();
    if (email !== undefined) updateData.email = email?.trim() || null;
    if (phone !== undefined) updateData.phone = phone?.trim() || null;
    if (dateOfBirth !== undefined) {
      updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    }

    // Update the patient in the database
    const updatedPatient = await prisma.patient.update({
      where: { id: id },
      data: updateData,
    });

    // Return the updated patient
    const response: ApiResponse<typeof updatedPatient> = {
      success: true,
      data: updatedPatient,
      message: "Patient updated successfully",
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// ============================================
// DELETE /api/patients/:id
// Delete a patient (hard delete - removes from database)
// ============================================
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      // Get userId from the JWT token
      const userId = req.userId!;

      // First, check if the patient exists and belongs to this doctor
      const existingPatient = await prisma.patient.findUnique({
        where: { id: id },
      });

      if (!existingPatient) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Patient not found",
        };
        return res.status(404).json(response);
      }

      if (existingPatient.userId !== userId) {
        const response: ApiResponse<null> = {
          success: false,
          error: "You don't have permission to delete this patient",
        };
        return res.status(403).json(response);
      }

      // Delete related records first
      // Deletes in the order: Summary -> Intake -> IntakeLink -> Appointment -> Patient

      // Get all intakes for this patient
      const intakes = await prisma.intake.findMany({
        where: { patientId: id },
        select: { id: true },
      });

      for (const intake of intakes) {
        await prisma.summary.deleteMany({
          where: { intakeId: intake.id },
        });
      }

      await prisma.intake.deleteMany({
        where: { patientId: id },
      });

      await prisma.intakeLink.deleteMany({
        where: { patientId: id },
      });

      await prisma.appointment.deleteMany({
        where: { patientId: id },
      });

      await prisma.patient.delete({
        where: { id: id },
      });

      // Return success message
      const response: ApiResponse<null> = {
        success: true,
        message: "Patient deleted successfully",
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
