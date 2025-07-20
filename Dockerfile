# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables (documented, not hardcoded)
# ENV MONGO_URI=your_mongo_uri
# ENV MAIL_USER=your_email
# ENV MAIL_PASS=your_email_password
# ENV JWT_SECRET=your_jwt_secret
# ENV SALT=10

# Start the app
CMD ["npm", "start"] 