# Stage 1: Build Stage
FROM node:18-alpine AS builder

# Install GPG for decryption
RUN apk add --no-cache gnupg

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies (including development dependencies)
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy encrypted .env file and secret.sh decryption script into the correct working directory
COPY .env.dev.gpg /app/.env.dev.gpg
COPY secret.sh /app/secret.sh

# Ensure secret.sh is executable using an absolute path
RUN chmod +x /app/secret.sh

# Pass the GPG passphrase as a build argument or environment variable
ARG SECRET_PASSPHRASE
ENV SECRET_PASSPHRASE=$SECRET_PASSPHRASE

# Decrypt the .env.dev.gpg file to .env
RUN /bin/sh /app/secret.sh dev decrypt

# Verify that the .env file exists after decryption
RUN ls -l /app/.env  # Debugging step to check if .env file exists

# Build the Next.js app using the decrypted .env file
RUN npm run build

# Stage 2: Production Stage
FROM node:18-alpine AS production

# Install GPG (if needed at runtime for security, otherwise this can be omitted)
RUN apk add --no-cache gnupg

# Set the working directory inside the container
WORKDIR /app

# Copy only the production dependencies and built files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy the decrypted .env file from the builder stage
COPY --from=builder /app/.env ./.env

# Install only production dependencies
RUN npm install --only=production

# Expose port 3000 (Next.js default port)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
