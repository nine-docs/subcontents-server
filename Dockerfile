# STEP 1: ts빌드
FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./  
RUN npm install --omit=dev 
COPY . .
RUN npm run build

# STEP 2: js빌드 및 실행
FROM node:16-alpine
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/dist ./dist

RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
EXPOSE 3000
CMD ["npm", "start:prod"]