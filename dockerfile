# Stage 1: Build Stage
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies (including development dependencies)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Production Stage
FROM node:18-alpine AS production

# Set the working directory inside the container
WORKDIR /app

# Copy only the production dependencies and built files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install only production dependencies
RUN npm install --only=production

# Expose port 3000 (Next.js default port)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
