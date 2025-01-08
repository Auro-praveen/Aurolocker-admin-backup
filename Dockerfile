# Use an official Node runtime as the base image
FROM node:14-alpine as build

# Set the working directory in the container
WORKDIR /locker-admin-dock

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app
RUN npm run build

# Use Nginx as the web server
FROM nginx:alpine

# Copy the built React app from the previous stage
COPY --from=build /locker-admin-dock/build /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]