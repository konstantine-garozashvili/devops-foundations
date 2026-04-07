FROM alpine:3.19 AS builder

WORKDIR /app
COPY . .

FROM nginx:1.27-alpine AS production

LABEL org.opencontainers.image.title="devops-foundations-frontend" \
      org.opencontainers.image.description="Frontend dashboard for the DevOps Foundations stack" \
      org.opencontainers.image.source="https://example.invalid/devops-foundations" \
      org.opencontainers.image.licenses="MIT"

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && mkdir -p /var/cache/nginx /tmp/nginx \
    && chown -R appuser:appgroup /usr/share/nginx/html /var/cache/nginx /tmp/nginx /etc/nginx/conf.d

COPY --from=builder --chown=appuser:appgroup /app /usr/share/nginx/html
COPY <<'NGINX_CONF' /etc/nginx/nginx.conf
worker_processes auto;
pid /tmp/nginx/nginx.pid;
events { worker_connections 1024; }
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;
    keepalive_timeout 65;
    client_body_temp_path /tmp/nginx/client_body;
    proxy_temp_path /tmp/nginx/proxy;
    fastcgi_temp_path /tmp/nginx/fastcgi;
    uwsgi_temp_path /tmp/nginx/uwsgi;
    scgi_temp_path /tmp/nginx/scgi;
    server {
        listen 8080;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        location / {
            try_files $uri $uri/ =404;
        }
    }
}
NGINX_CONF

RUN chown appuser:appgroup /etc/nginx/nginx.conf

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1:8080 || exit 1
