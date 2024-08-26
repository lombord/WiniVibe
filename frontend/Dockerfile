FROM node:20-bullseye-slim as dev

# Workdir for app
WORKDIR /usr/src/app

# Copy requirements for packages 
COPY package*.json ./


# cache npm packages and install
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm install

COPY . .

CMD ["npm", "run", "dev"]