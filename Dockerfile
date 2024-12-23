# Use Node.js LTS (Latest LTS version)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application (modified)
CMD ["sh", "-c", "npm run build && npm start"]