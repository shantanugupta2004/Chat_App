# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend files
COPY . .

# Build the React app
RUN npm run build

# Install `serve` to serve the built files
RUN npm install -g serve

# Expose frontend port
EXPOSE 4173

# Serve the build using a simple static server
CMD ["serve", "-s", "dist", "-l", "4173"]
