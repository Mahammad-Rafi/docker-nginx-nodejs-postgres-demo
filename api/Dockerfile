FROM node:24-alpine

LABEL org.opencontainers.image.source="https://github.com/zhargan-byte/docker-bridge-demo"
LABEL org.opencontainers.image.title="Docker Bridge Demo API"
LABEL org.opencontainers.image.description="Node.js API tier for the Docker Bridge Demo three-tier application"
LABEL org.opencontainers.image.licenses="MIT"

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server.js db.js ./
COPY routes ./routes

USER node
EXPOSE 3000

CMD ["node", "server.js"]

