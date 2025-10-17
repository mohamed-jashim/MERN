# Use official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy remaining backend files
COPY . .

# Expose the backend port (adjust if not 5000)
EXPOSE 8000

# Start the backend
CMD ["npm", "start"]
