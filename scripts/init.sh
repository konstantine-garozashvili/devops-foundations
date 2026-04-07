#!/usr/bin/env bash
set -euo pipefail

GREEN="\033[32m"
YELLOW="\033[33m"
RESET="\033[0m"

echo -e "${YELLOW}===> DevOps Foundations: Infrastructure Initialization <===${RESET}"

# 1. Environment variables
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env from .env.example...${RESET}"
    cp .env.example .env
else
    echo -e "${GREEN}.env already exists.${RESET}"
fi

# 2. TLS Certificates
echo -e "${YELLOW}Running certificate generation...${RESET}"
./scripts/generate-certs.sh

# 3. Docker setup
echo -e "${YELLOW}Starting docker compose infrastructure...${RESET}"
docker compose --env-file .env down
docker compose --env-file .env up -d --build
echo -e "---"
echo -e "${YELLOW}🔒 Traefik Default Credentials${RESET}"
echo -e "- Username: devops"
echo -e "- Password: devops_admin"
echo -e "${GREEN}===> Initialization complete! Services are booting. <===${RESET}"
echo -e "- Frontend Dashboard: https://app.localhost"
echo -e "- Backend API: https://api.localhost"
echo -e "- Traefik Proxy: https://traefik.localhost"
echo -e "- MailHog Web: https://mail.localhost"
echo -e "- Adminer DB UI: https://db.localhost"
