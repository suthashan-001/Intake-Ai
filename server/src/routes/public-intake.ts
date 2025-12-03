// Public Intake Routes

// These routes are PUBLIC - no authentication added!
// Patients use these routes to access and submit their intake forms

// The token in the URL acts as a one-time access key
import { Router, Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { ApiResponse } from "../types";

// Create the router for public intake routes
const router = Router();

// ============================================
// Intake Form Questions
// these questions will eventually come from a database --- this is just for testing purposes
// ============================================
const INTAKE_FORM_QUESTIONS = [
  {
    id: "chiefComplaint",
    question: "What is the main reason for your visit today?",
    type: "textarea",
    required: true,
  },
  {
    id: "symptoms",
    question: "Please describe your symptoms in detail.",
    type: "textarea",
    required: true,
  },
  {
    id: "symptomDuration",
    question: "How long have you been experiencing these symptoms?",
    type: "text",
    required: true,
  },
  {
    id: "medications",
    question:
      "List any medications you are currently taking (including dosage).",
    type: "textarea",
    required: false,
  },
  {
    id: "supplements",
    question: "List any supplements or vitamins you take regularly.",
    type: "textarea",
    required: false,
  },
  {
    id: "allergies",
    question: "Do you have any allergies? (medications, foods, environmental)",
    type: "textarea",
    required: false,
  },
  {
    id: "medicalHistory",
    question: "Please describe your relevant medical history.",
    type: "textarea",
    required: false,
  },
  {
    id: "familyHistory",
    question: "Is there any relevant family medical history?",
    type: "textarea",
    required: false,
  },
  {
    id: "lifestyle",
    question: "Describe your lifestyle (diet, exercise, sleep, stress levels).",
    type: "textarea",
    required: false,
  },
  {
    id: "goals",
    question: "What are your health goals for this visit?",
    type: "textarea",
    required: false,
  },
];

// ============================================
// GET /api/public/intake/:token
// Validate the token and return patient info + form questions

// This is what the patient sees when they open the intake link
// ============================================
router.get(
  "/:token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;

      // Validate token format (should be 64 hex characters)
      if (!token || token.length !== 64 || !/^[a-f0-9]+$/i.test(token)) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Invalid intake link",
        };
        return res.status(400).json(response);
      }

      // Find the intake link by token
      const intakeLink = await prisma.intakeLink.findUnique({
        where: { token: token },
        include: {
          patient: {
            select: {
              firstName: true,
            },
          },
        },
      });

      // Check if the link exists
      if (!intakeLink) {
        const response: ApiResponse<null> = {
          success: false,
          error:
            "Intake link not found. Please contact your healthcare provider.",
        };
        return res.status(404).json(response);
      }

      // Check if the link has already been used
      if (intakeLink.isUsed) {
        const response: ApiResponse<null> = {
          success: false,
          error: "This intake form has already been submitted.",
        };
        return res.status(400).json(response);
      }

      // Check if the link has expired
      const now = new Date();
      if (intakeLink.expiresAt < now) {
        const response: ApiResponse<null> = {
          success: false,
          error:
            "This intake link has expired. Please contact your healthcare provider for a new link.",
        };
        return res.status(400).json(response);
      }

      // Link is valid! Return patient info and form questions
      const response: ApiResponse<{
        patientFirstName: string;
        expiresAt: Date;
        questions: typeof INTAKE_FORM_QUESTIONS;
      }> = {
        success: true,
        data: {
          patientFirstName: intakeLink.patient.firstName,
          expiresAt: intakeLink.expiresAt,
          questions: INTAKE_FORM_QUESTIONS,
        },
        message: "Intake form loaded successfully",
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// POST /api/public/intake/:token
// Submit the intake form responses
// This is called when the patient clicks "Submit"
// ============================================
router.post(
  "/:token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      const { responses } = req.body;

      // Validate token format
      if (!token || token.length !== 64 || !/^[a-f0-9]+$/i.test(token)) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Invalid intake link",
        };
        return res.status(400).json(response);
      }

      // Validate responses object exists
      if (!responses || typeof responses !== "object") {
        const response: ApiResponse<null> = {
          success: false,
          error: "Form responses are required",
        };
        return res.status(400).json(response);
      }

      // Validate required fields are filled
      const requiredQuestions = INTAKE_FORM_QUESTIONS.filter((q) => q.required);
      const missingFields: string[] = [];

      for (const question of requiredQuestions) {
        if (!responses[question.id] || responses[question.id].trim() === "") {
          missingFields.push(question.id);
        }
      }

      if (missingFields.length > 0) {
        const response: ApiResponse<null> = {
          success: false,
          error: `Please fill in all required fields: ${missingFields.join(
            ", "
          )}`,
        };
        return res.status(400).json(response);
      }

      // Find the intake link by token
      const intakeLink = await prisma.intakeLink.findUnique({
        where: { token: token },
        include: {
          patient: true,
        },
      });

      // Check if the link exists
      if (!intakeLink) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Intake link not found",
        };
        return res.status(404).json(response);
      }

      // Check if the link has already been used
      if (intakeLink.isUsed) {
        const response: ApiResponse<null> = {
          success: false,
          error: "This intake form has already been submitted",
        };
        return res.status(400).json(response);
      }

      // Check if the link has expired
      const now = new Date();
      if (intakeLink.expiresAt < now) {
        const response: ApiResponse<null> = {
          success: false,
          error: "This intake link has expired",
        };
        return res.status(400).json(response);
      }

      // Create the Intake record and update the IntakeLink
      const result = await prisma.$transaction(async (tx) => {
        // Create the Intake record with the form responses
        const intake = await tx.intake.create({
          data: {
            patientId: intakeLink.patientId,
            intakeLinkId: intakeLink.id,
            status: "COMPLETED", // Form is complete when submitted
            responses: responses,
            completedAt: now,
          },
        });

        // Mark the IntakeLink as used
        await tx.intakeLink.update({
          where: { id: intakeLink.id },
          data: {
            isUsed: true,
            usedAt: now,
          },
        });

        return intake;
      });

      // Return success
      const response: ApiResponse<{ intakeId: string }> = {
        success: true,
        data: {
          intakeId: result.id,
        },
        message: "Thank you! Your intake form has been submitted successfully.",
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
