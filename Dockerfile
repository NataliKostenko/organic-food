# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY gulpfile.js ./
COPY src/ ./src/
COPY assets/ ./assets/

# Build the project
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install a simple HTTP server
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/assets ./assets
COPY index.html ./
COPY favicon.ico ./

# Expose port
EXPOSE 3000

# Serve the application
CMD ["serve", "-s", ".", "-l", "3000"]