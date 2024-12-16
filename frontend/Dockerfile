ARG NODE_VERSION=20.9.0
ARG PNPM_VERSION=10.9.0

# Use an official Node runtime as a parent image

# FROM node:${NODE_VERSION}-alpine

# # Set the working directory to /app
# WORKDIR /app
# COPY . .

# ENV CI=false

# # Copy the package.json and pnpm-lock.yaml to the working directory
# WORKDIR /app/frontend
# RUN npm ci
# RUN npm run build 

# # Expose port 3000 for the application
# EXPOSE 3000
# ENTRYPOINT ["pnpm", "preview"]

# Start the application
# CMD ["node", "/app/frontend/dist/server.js"]

FROM node:${NODE_VERSION}-alpine as base

COPY . /app
WORKDIR /app

WORKDIR /app/frontend
RUN npm install --legacy-peer-deps
RUN npm run build


EXPOSE 3000
CMD [ "npm", "run", "preview" ]
