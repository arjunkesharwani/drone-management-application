FROM node:18.16-alpine3.17
LABEL Author Arjun Kesharwani <arjun.kesharwani246@gmail.com>

RUN apk add bash --no-cache

# Create app directory
WORKDIR /usr/src/drone-management-system

# Install app dependencies
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Server startup PORT
ARG port
ENV PORT=$port

# Expose the app port
EXPOSE ${PORT} 3000

# Command to run application
CMD ["npm", "run", "start"]