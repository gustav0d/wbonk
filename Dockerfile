# Stage 1: Build environment
FROM node:22.15.0-slim AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy necessary files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches
COPY apps/server/package.json ./apps/server/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all files
COPY . .

# Build the server
RUN pnpm run --filter @wbonk/server build

# Stage 2: Production image
FROM node:22.15.0-slim

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./

# Copy production node_modules
COPY --from=builder /app/node_modules ./node_modules

# Environment variables
ENV NODE_ENV production
ENV PORT 8080

# Expose port and start
EXPOSE 8080
CMD ["pnpm", "run" , "start"]
