# Use the official Node.js image
FROM node:22.16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the port your app runs on (based on your code or .env, defaulting to 5000)
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
