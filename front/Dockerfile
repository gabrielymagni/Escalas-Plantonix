# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os manifestos primeiro para aproveitar cache
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# VITE_API_URL relativo: o nginx do container faz o proxy para o backend
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---- Stage 2: Serve ----
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
