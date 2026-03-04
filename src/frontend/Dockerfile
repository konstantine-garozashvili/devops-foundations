# Stage 1: builder (placeholder for future tooling if needed)
FROM alpine:3.19 AS builder

WORKDIR /app
COPY . .

# No build step yet – static assets only. Tooling (npm, bundlers, etc.)
# can be added later in a dedicated feature.

# Stage 2: production web server
FROM nginx:1.27-alpine AS production

LABEL org.opencontainers.image.title="devops-foundations-frontend" \
      org.opencontainers.image.description="Frontend dashboard for the DevOps Foundations stack" \
      org.opencontainers.image.source="https://example.invalid/devops-foundations" \
      org.opencontainers.image.licenses="MIT"

# Serve static files from the default nginx html directory
COPY --from=builder /app /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost || exit 1
