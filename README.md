# DevOps Foundations

DevOps Foundations project – production-style, containerized infrastructure with Docker, Traefik, and a simple microservices architecture.

> **Status**: Repository structure scaffolding in progress on `feature/setup-repo-structure`.

## Project overview and goals

- **Goal**: Build a realistic, production-like environment for a small microservices stack (frontend + backend + supporting services) with a strong focus on DevOps practices.
- **Scope**:
  - Simple Node.js backend API (minimal REST, using the Node `http` module).
  - Simple frontend dashboard (plain HTML/CSS/JS).
  - Traefik as reverse proxy and load balancer for all HTTP(S) traffic.
  - PostgreSQL, Redis, MailHog for data, caching, and email testing.
  - Multi-environment support (development and production-like).

For detailed rules and constraints, see `devops-foundations.rules.md`.

## Prerequisites

- Docker and Docker Compose (compatible with `docker compose` v2 CLI).
- `mkcert` installed for generating local TLS certificates.
- Git (with GitFlow-style workflow: `main`, `develop`, and feature branches).
- Recent Node.js LTS installed (for local development and tooling).

## Getting started (development)

> The commands below are placeholders and will be refined as services and scripts are implemented.

1. Clone the repository:

```bash
git clone <YOUR_REPO_URL> devops-foundations
cd devops-foundations
```

2. Create your local environment file from the example:

```bash
cp .env.example .env
```

3. Generate local TLS certificates (script to be implemented in `scripts/generate-certs.sh`):

```bash
./scripts/generate-certs.sh
```

4. Start the stack in development mode:

```bash
docker compose up
```

5. Stop the stack:

```bash
docker compose down
```

## Common commands

- **Start dev stack**: `docker compose up`
- **Stop stack**: `docker compose down`
- **Rebuild images** (once Dockerfiles are added): `docker compose build`
- **View logs**: `docker compose logs -f`

Additional commands for scripts and per-service tooling will be documented here as they are added.

## Service URLs

Once the stack is fully configured, the expected HTTPS endpoints will be:

- Frontend dashboard: `https://app.localhost`
- Backend API: `https://api.localhost`
- Database admin UI: `https://db.localhost`
- MailHog UI: `https://mail.localhost`
- Traefik dashboard: `https://traefik.localhost`

## Contributing

See `CONTRIBUTING.md` for:

- Branching strategy (GitFlow).
- Commit conventions (Conventional Commits).
- Code review process and self-review checklist.
