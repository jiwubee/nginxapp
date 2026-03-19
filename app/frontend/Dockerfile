FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./

# Prawidłowy syntax z fallback'iem
RUN npm ci || npm install

COPY public ./public
COPY src ./src

ENV NODE_ENV=production
RUN npm run build

# Weryfikacja
RUN ls -la build/ || (echo "Build failed!" && exit 1)

FROM nginx:1.26-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /var/cache/nginx/stats && \
    chown -R nginx:nginx /var/cache/nginx && \
    chmod -R 755 /var/cache/nginx

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]