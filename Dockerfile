FROM node:12

# Ensure there is a working directory
RUN mkdir -p /app
WORKDIR /app

# Install node dependencies
COPY ./package*.json /app/
RUN npm install

# Set up the rest of the application's code
COPY . /app
