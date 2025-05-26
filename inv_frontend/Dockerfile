# ---------- Stage 1: Build ----------
    FROM node:22.16-alpine AS builder

    # Set working directory
    WORKDIR /app
    
    # Install all dependencies (including dev)
    COPY package*.json ./
    RUN npm install --legacy-peer-deps
    
    # Copy .env file for build-time environment variables
    COPY .env .env
    
    # Copy the rest of the app and build it
    COPY . .
    RUN npm run build
    
    # ---------- Stage 2: Production ----------
    FROM node:22.16-alpine
    
    # Set working directory
    WORKDIR /app
    
    # Install only production dependencies
    COPY package*.json ./
    RUN npm install --legacy-peer-deps --only=production
    
    # Copy build output and necessary files from builder stage
    COPY --from=builder /app/.next .next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/next.config.mjs ./next.config.mjs
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/.env .env
    
    # Expose Next.js default port
    EXPOSE 3000
    
    # Start the production server
    CMD ["npm", "run", "start"]
    