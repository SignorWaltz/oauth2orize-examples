# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the Docker image
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the Docker image
COPY package*.json ./

# Install the application dependencies in the Docker image
RUN npm install

# Copy the rest of the application to the Docker image
COPY . .

# Copy the SSL certificates into the Docker image
COPY certificate /usr/src/app/certificate

# Expose port 37166 to the outside world
EXPOSE 37166

# Expose port 443 to the outside world
EXPOSE 443

# Start the application
CMD [ "node", "app.js" ]
