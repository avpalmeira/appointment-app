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

# Seed the database and start the app
CMD ["sh", "-c", "node scripts/seed.js && npm run build && npm start"]