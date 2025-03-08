# backend/Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port (default to 4000 for this new backend)
EXPOSE 4000

# Start the server
CMD ["node", "server.js"]