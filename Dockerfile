# Multi-stage build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install --only=production
RUN cd client && npm install

# Copy source code
COPY . .

# Build frontend
RUN cd client && npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy backend dependencies and built frontend
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/client/build ./client/build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./
COPY --from=builder /app/uploads ./uploads

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Set environment
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
