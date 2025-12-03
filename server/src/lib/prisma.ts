// Prisma Client Singleton

import { PrismaClient } from "@prisma/client";

// This connects to our PostgreSQL database using the DATABASE_URL from .env
const prisma = new PrismaClient();

export default prisma;
