# ===========================================
# IntakeAI Client Dockerfile
# Multi-stage build: Node for building, Nginx for serving
# ===========================================

# -----------------------------------------
# Stage 1: Build
# Build the React/Vite application
# -----------------------------------------
FROM node:20-alpine AS builder


WORKDIR /app

COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# copy source code
COPY . .


ARG VITE_API_URL=http://localhost:3001/api
ENV VITE_API_URL=$VITE_API_URL


RUN npm run build

# -----------------------------------------
# Stage 2: Production
# Nginx to serve static files
# -----------------------------------------
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check - verify nginx is responding
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Start nginx in foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]
