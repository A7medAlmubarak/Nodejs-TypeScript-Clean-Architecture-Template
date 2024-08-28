# Node JS Image
FROM node:latest

# Set Working Directory
WORKDIR /app

COPY package.json .

# Install Dependencies
RUN npm install

COPY . .

# Expose Port
EXPOSE 3000

# Build App
#RUN npm run build

# Start App
CMD ["npm", "run", "start"]
