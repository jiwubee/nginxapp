FROM node:20-alpine

RUN apk add --no-cache wget curl

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev || npm install --production

COPY server.js .

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["node", "server.js"]