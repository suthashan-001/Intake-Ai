// Authentication Routes
// Handles user registration, login, token refresh, and logout
// Uses JWT for authentication

import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../lib/prisma";
import { ApiResponse } from "../types";
import { JWT_SECRET } from "../middleware/auth";

// Create the router for auth routes
const router = Router();

// Token expiration times
const ACCESS_TOKEN_EXPIRES = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRES_DAYS = 7; // 7 days

// ============================================
// Helper Functions
// ============================================

function generateAccessToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });
}

function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

// ============================================
// POST /api/auth/register
// Register a new doctor account
// ============================================
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, firstName, lastName, practiceName } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName || !practiceName) {
        const response: ApiResponse<null> = {
          success: false,
          error:
            "Missing required fields: email, password, firstName, lastName, practiceName",
        };
        return res.status(400).json(response);
      }

      // Validate email format (basic check)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Invalid email format",
        };
        return res.status(400).json(response);
      }

      // Validate password length
      if (password.length < 8) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Password must be at least 8 characters long",
        };
        return res.status(400).json(response);
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        const response: ApiResponse<null> = {
          success: false,
          error: "An account with this email already exists",
        };
        return res.status(409).json(response);
      }

      // Hash the password using bcrypt
      // Salt rounds = 10
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create the user in the database
      const newUser = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          practiceName: practiceName.trim(),
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          practiceName: true,
          title: true,
          createdAt: true,
        },
      });

      const response: ApiResponse<typeof newUser> = {
        success: true,
        data: newUser,
        message: "Account created successfully. Please log in.",
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// POST /api/auth/login
// Log in and get access + refresh tokens
// ============================================
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Email and password are required",
        };
        return res.status(400).json(response);
      }

      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Invalid email or password",
        };
        return res.status(401).json(response);
      }

      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Invalid email or password",
        };
        return res.status(401).json(response);
      }

      // Generate tokens
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken();

      // Calculate refresh token expiration
      const refreshExpiresAt = new Date();
      refreshExpiresAt.setDate(
        refreshExpiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS
      );

      // Save refresh token to database
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          expiresAt: refreshExpiresAt,
          userId: user.id,
          userAgent: req.headers["user-agent"] || null,
          ipAddress: req.ip || null,
        },
      });

      // Return tokens and user info
      const response: ApiResponse<{
        accessToken: string;
        refreshToken: string;
        user: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          title: string;
          practiceName: string;
        };
      }> = {
        success: true,
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            title: user.title,
            practiceName: user.practiceName,
          },
        },
        message: "Login successful",
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// POST /api/auth/refresh
// Get a new access token using a refresh token
// ============================================
router.post(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      // Validate refresh token is provided
      if (!refreshToken) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Refresh token is required",
        };
        return res.status(400).json(response);
      }

      // Find the refresh token in the database
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      // Check if token exists
      if (!storedToken) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Invalid refresh token",
        };
        return res.status(401).json(response);
      }

      // Check if token is revoked
      if (storedToken.isRevoked) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Refresh token has been revoked",
        };
        return res.status(401).json(response);
      }

      // Check if token is expired
      if (storedToken.expiresAt < new Date()) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Refresh token has expired. Please log in again.",
        };
        return res.status(401).json(response);
      }

      // Generate a new access token
      const newAccessToken = generateAccessToken(
        storedToken.user.id,
        storedToken.user.email
      );

      const response: ApiResponse<{ accessToken: string }> = {
        success: true,
        data: {
          accessToken: newAccessToken,
        },
        message: "Token refreshed successfully",
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// POST /api/auth/logout
// Revoke a refresh token (log out)
// ============================================
router.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      // Validate refresh token is provided
      if (!refreshToken) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Refresh token is required",
        };
        return res.status(400).json(response);
      }

      // Find and revoke the refresh token
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (storedToken && !storedToken.isRevoked) {
        // Mark the token as revoked
        await prisma.refreshToken.update({
          where: { token: refreshToken },
          data: {
            isRevoked: true,
            revokedAt: new Date(),
          },
        });
      }

      // Always return success
      const response: ApiResponse<null> = {
        success: true,
        message: "Logged out successfully",
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// GET /api/auth/me
// Get current user info
// ============================================
router.get("/me", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const response: ApiResponse<null> = {
        success: false,
        error: "No token provided",
      };
      return res.status(401).json(response);
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    let decoded: { userId: string; email: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
      };
    } catch {
      const response: ApiResponse<null> = {
        success: false,
        error: "Invalid or expired token",
      };
      return res.status(401).json(response);
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        title: true,
        practiceName: true,
        createdAt: true,
      },
    });

    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: "User not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
