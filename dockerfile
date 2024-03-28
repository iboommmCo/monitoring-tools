
FROM node:16.3.0-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
RUN npm install

EXPOSE 3000
CMD ["node", "api/index.js"]

# --platform linux/amd64 