FROM node:lts-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.js ./

FROM node:lts-alpine AS production

WORKDIR /app

LABEL org.opencontainers.image.title="devops-foundations-backend" \
      org.opencontainers.image.description="Backend API for the DevOps Foundations stack" \
      org.opencontainers.image.source="https://example.invalid/devops-foundations" \
      org.opencontainers.image.licenses="MIT"

# Create and use non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app /app

USER appuser

ENV NODE_ENV=production
ENV BACKEND_PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost:${BACKEND_PORT}/health || exit 1

CMD ["node", "server.js"]

