FROM node:12
 
# Ensure we are running in production mode
ENV NODE_ENV=production

# Ensure there is a working directory
RUN mkdir -p /app
WORKDIR /app

# Install node dependencies
COPY ./package*.json /app/
RUN npm install

# Set up the rest of the application's code
COPY . /app

# Build the admin dashboard
RUN npm run build

# Setup starting command
CMD ["npm", "start"]
