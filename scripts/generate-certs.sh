#!/usr/bin/env bash
set -euo pipefail

# === COLORS ===
GREEN="\033[32m"
YELLOW="\033[33m"
RED="\033[31m"
RESET="\033[0m"

echo -e "${YELLOW}===> Local TLS Certificates setup (mkcert) <===${RESET}"

# Verify mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo -e "${RED}[!] mkcert not found! Attempting to install via Homebrew...${RESET}"
    if command -v brew &> /dev/null; then
        brew install mkcert nss
    else
        echo -e "${RED}[ERROR] Homebrew is not installed. Please install mkcert manually.${RESET}"
        exit 1
    fi
fi

# Ensure mkcert local root CA is installed
echo -e "${YELLOW}===> Ensuring local CA is installed...${RESET}"
mkcert -install

CERTS_DIR="traefik/certs"
mkdir -p "$CERTS_DIR"

CERT_FILE="$CERTS_DIR/local-cert.pem"
KEY_FILE="$CERTS_DIR/local-key.pem"

echo -e "${YELLOW}===> Generating certificates for *.localhost domains...${RESET}"
mkcert \
  -cert-file "$CERT_FILE" \
  -key-file "$KEY_FILE" \
  "*.localhost" \
  "api.localhost" \
  "app.localhost" \
  "traefik.localhost" \
  "mail.localhost" \
  "db.localhost" \
  "localhost" \
  "127.0.0.1" \
  "::1"

echo -e "${GREEN}===> Certificates generated successfully in $CERTS_DIR!${RESET}"
echo -e "Certificates are ignored in git via .gitignore"
