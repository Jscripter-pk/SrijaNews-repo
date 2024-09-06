# Use the official Node.js image as a base image
FROM node:18-alpine AS base

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000 (Next.js default port)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
