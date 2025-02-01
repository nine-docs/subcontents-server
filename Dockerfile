FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV production

RUN apk add --no-cache openssl tini

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

ENTRYPOINT ["/sbin/tini", "--"]
EXPOSE 3000

# 환경 변수를 통한 DB 연결 설정 (docker-compose.yml 등에서 설정)
CMD ["node", "dist/main"]