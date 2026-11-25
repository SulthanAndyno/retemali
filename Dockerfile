FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Dummy URL so Prisma generate can run at build time; runtime DATABASE_URL comes from .env
ENV DATABASE_URL=postgresql://retemali:retemali@localhost:5432/retemali?schema=public
RUN npx prisma generate
RUN npm run build
EXPOSE 2000
CMD ["node", "-r", "tsconfig-paths/register", "dist/server.js"]
