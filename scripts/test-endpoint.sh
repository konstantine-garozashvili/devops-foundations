#!/usr/bin/env bash
set -euo pipefail

GREEN="\033[32m"
RED="\033[31m"
YELLOW="\033[33m"
RESET="\033[0m"

BASE_URL="${1:-https://api.localhost}"
CURL_INSECURE="${CURL_INSECURE:-true}"

if [ "${CURL_INSECURE}" = "true" ]; then
  CURL_TLS_FLAG="-k"
else
  CURL_TLS_FLAG=""
fi

PASS_COUNT=0
FAIL_COUNT=0

run_test() {
  local name="$1"
  local method="$2"
  local endpoint="$3"
  local expected_status="$4"
  local data="${5:-}"

  local url="${BASE_URL}${endpoint}"
  local response
  local body
  local status

  if [ -n "${data}" ]; then
    response="$(curl -sS ${CURL_TLS_FLAG} -X "${method}" \
      -H "Content-Type: application/json" \
      -d "${data}" \
      -w $'\n%{http_code}' \
      "${url}" || true)"
  else
    response="$(curl -sS ${CURL_TLS_FLAG} -X "${method}" \
      -w $'\n%{http_code}' \
      "${url}" || true)"
  fi

  body="$(printf "%s" "${response}" | sed '$d')"
  status="$(printf "%s" "${response}" | sed -n '$p')"

  if [ "${status}" = "${expected_status}" ]; then
    echo -e "${GREEN}[PASS]${RESET} ${name} -> ${method} ${endpoint} (HTTP ${status})"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo -e "${RED}[FAIL]${RESET} ${name} -> ${method} ${endpoint} (expected ${expected_status}, got ${status:-N/A})"
    if [ -n "${body}" ]; then
      echo -e "${YELLOW}Response:${RESET} ${body}"
    fi
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

echo -e "${YELLOW}Testing backend endpoints on:${RESET} ${BASE_URL}"

run_test "Root endpoint" "GET" "/" "200"
run_test "Health endpoint" "GET" "/health" "200"
run_test "Database endpoint" "GET" "/db" "200"
run_test "Cache endpoint" "GET" "/cache" "200"
run_test "Contact endpoint" "POST" "/contact" "200" '{"name":"DevOps Tester","email":"tester@example.local","message":"Automated endpoint test message"}'

echo
echo -e "Passed: ${GREEN}${PASS_COUNT}${RESET}"
echo -e "Failed: ${RED}${FAIL_COUNT}${RESET}"

if [ "${FAIL_COUNT}" -gt 0 ]; then
  exit 1
fi

echo -e "${GREEN}All backend endpoint tests passed.${RESET}"
