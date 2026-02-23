# Stage 1: Build the frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package.json ./frontend/
RUN npm install --prefix frontend
COPY frontend/ ./frontend/
RUN npm run build --prefix frontend

# Stage 2: Production image
FROM node:22-alpine
WORKDIR /app
COPY backend/package.json .
RUN npm install --omit=dev
COPY backend/ .
COPY --from=frontend-builder /app/frontend/dist ./public
EXPOSE 8080
CMD ["node", "server.js"]
