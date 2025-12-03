// Summary Routes

// These routes handle AI-generated clinical summaries
// The main route takes an intake submission and generates a summary using Gemini AI

import { Router, Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { ApiResponse } from "../types";
import { generateSummary, SummaryData } from "../services/ai-summary";

// Create the router for summary routes
const router = Router();

//use a fake ID for testing
const FAKE_USER_ID = "fake-doctor-id-for-testing";

// ============================================
// POST /api/intakes/:intakeId/generate-summary
// Generate an AI summary for a specific intake
// ============================================

// TESTING FOR GEMINI API
router.post(
  "/:intakeId/generate-summary",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { intakeId } = req.params;
      const userId = FAKE_USER_ID;

      console.log(`Generating summary for intake: ${intakeId}`);

      // Step 1: Find the intake and verify it exists
      const intake = await prisma.intake.findUnique({
        where: { id: intakeId },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              userId: true,
            },
          },
          summary: true, // Check if summary already exists
        },
      });

      // Check if intake exists
      if (!intake) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Intake not found",
        };
        return res.status(404).json(response);
      }

      // Check if the intake belongs to the logged-in doctor's patient
      if (intake.patient.userId !== userId) {
        const response: ApiResponse<null> = {
          success: false,
          error:
            "You don't have permission to generate a summary for this intake",
        };
        return res.status(403).json(response);
      }

      // Check if intake has responses to analyze
      if (!intake.responses) {
        const response: ApiResponse<null> = {
          success: false,
          error: "This intake has no responses to analyze",
        };
        return res.status(400).json(response);
      }

      // Check if a summary already exists
      // If so, we'll delete it and regenerate
      if (intake.summary) {
        console.log("Existing summary found, deleting before regenerating...");
        await prisma.summary.delete({
          where: { id: intake.summary.id },
        });
      }

      // Call the AI service to generate the summary
      console.log("Calling AI service...");
      const summaryData: SummaryData = await generateSummary(
        intake.responses as Record<string, any>
      );

      //  Save the summary to the database
      console.log("Saving summary to database...");
      const savedSummary = await prisma.summary.create({
        data: {
          intakeId: intakeId,
          chiefComplaint: summaryData.chiefComplaint,
          medications: summaryData.medications as any,
          systemsReview: summaryData.systemsReview as any,
          relevantHistory: summaryData.relevantHistory,
          lifestyle: summaryData.lifestyle,
          redFlags: summaryData.redFlags as any,
          hasRedFlags: summaryData.hasRedFlags,
          redFlagCount: summaryData.redFlagCount,
        },
      });

      // Update the intake status to REVIEWED if it has red flags, otherwise keep as COMPLETED
      if (summaryData.hasRedFlags) {
        await prisma.intake.update({
          where: { id: intakeId },
          data: { status: "FLAGGED" },
        });
      }

      console.log(`Summary created successfully (ID: ${savedSummary.id})`);

      // Return the generated summary
      const response: ApiResponse<typeof savedSummary> = {
        success: true,
        data: savedSummary,
        message: summaryData.hasRedFlags
          ? `Summary generated with ${summaryData.redFlagCount} red flag(s) identified`
          : "Summary generated successfully",
      };

      res.status(201).json(response);
    } catch (error) {
      console.error("Error generating summary:", error);

      // Handle specific errors
      if (error instanceof Error) {
        const response: ApiResponse<null> = {
          success: false,
          error: error.message,
        };
        return res.status(500).json(response);
      }

      next(error);
    }
  }
);

// ============================================
// GET /api/intakes/:intakeId/summary
// Get the summary for a specific intake
// ============================================
router.get(
  "/:intakeId/summary",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { intakeId } = req.params;
      const userId = FAKE_USER_ID;

      // Find the intake with its summary
      const intake = await prisma.intake.findUnique({
        where: { id: intakeId },
        include: {
          patient: {
            select: {
              userId: true,
            },
          },
          summary: true,
        },
      });

      // Check if intake exists
      if (!intake) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Intake not found",
        };
        return res.status(404).json(response);
      }

      // Check permissions
      if (intake.patient.userId !== userId) {
        const response: ApiResponse<null> = {
          success: false,
          error: "You don't have permission to view this summary",
        };
        return res.status(403).json(response);
      }

      // Check if summary exists
      if (!intake.summary) {
        const response: ApiResponse<null> = {
          success: false,
          error: "No summary has been generated for this intake yet",
        };
        return res.status(404).json(response);
      }

      // Return the summary
      const response: ApiResponse<typeof intake.summary> = {
        success: true,
        data: intake.summary,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// GET /api/intakes
// List all intakes for the logged-in doctor's patients
// ============================================
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = FAKE_USER_ID;

    // Get query parameters for filtering
    const { status, hasSummary } = req.query;

    // Build the where clause for filtering
    const whereClause: any = {
      patient: {
        userId: userId,
      },
    };

    // Filter by status if provided
    if (status && typeof status === "string") {
      whereClause.status = status.toUpperCase();
    }

    // Get all intakes for this doctor's patients
    const intakes = await prisma.intake.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        summary: {
          select: {
            id: true,
            hasRedFlags: true,
            redFlagCount: true,
            chiefComplaint: true,
          },
        },
      },
    });

    // Filter by hasSummary if provided
    let filteredIntakes = intakes;
    if (hasSummary === "true") {
      filteredIntakes = intakes.filter((intake) => intake.summary !== null);
    } else if (hasSummary === "false") {
      filteredIntakes = intakes.filter((intake) => intake.summary === null);
    }

    const response: ApiResponse<typeof filteredIntakes> = {
      success: true,
      data: filteredIntakes,
      message: `Found ${filteredIntakes.length} intakes`,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// ============================================
// GET /api/intakes/:intakeId
// Get a single intake with full details
// ============================================
router.get(
  "/:intakeId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { intakeId } = req.params;
      const userId = FAKE_USER_ID;

      // Find the intake with all related data
      const intake = await prisma.intake.findUnique({
        where: { id: intakeId },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              userId: true,
            },
          },
          summary: true,
          intakeLink: {
            select: {
              createdAt: true,
              usedAt: true,
            },
          },
        },
      });

      // Check if intake exists
      if (!intake) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Intake not found",
        };
        return res.status(404).json(response);
      }

      // Check permissions
      if (intake.patient.userId !== userId) {
        const response: ApiResponse<null> = {
          success: false,
          error: "You don't have permission to view this intake",
        };
        return res.status(403).json(response);
      }

      const response: ApiResponse<typeof intake> = {
        success: true,
        data: intake,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
