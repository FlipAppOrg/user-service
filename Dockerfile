# Use an official Node.js runtime as the parent image
FROM node:16

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies inside the container
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Specify the command to run on container start
CMD [ "npm", "start" ]
