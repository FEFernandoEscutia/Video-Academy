# Use Node.js as base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Install Prisma client and generate Prisma files
RUN npx prisma generate

# Expose the app on port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:dev"]