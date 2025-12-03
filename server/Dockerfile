# ===========================================
# IntakeAI Server Dockerfile
# ===========================================

# -----------------------------------------
# Stage 1: Build
# Install dependencies and compile TypeScript
# -----------------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app


COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Install ALL dependencies 
RUN npm install

# Generate Prisma Client
# This creates the database client based on our schema
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# -----------------------------------------
# Stage 2: Production
# -----------------------------------------
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json* ./

# Copy prisma schema (needed for runtime)
COPY prisma ./prisma
RUN npm install --omit=dev

# Generate Prisma Client for production
RUN npx prisma generate

# Copy built JavaScript from builder stage
COPY --from=builder /app/dist ./dist

# Expose the server port
EXPOSE 3001

# Health check - verify server is responding
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Start the server
CMD ["node", "dist/index.js"]
