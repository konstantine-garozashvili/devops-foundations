# Contributing to DevOps Foundations

This project follows a **GitFlow**-style workflow and **Conventional Commits**. The focus is on clean infrastructure, clear history, and reproducible environments.

## Branching strategy (GitFlow)

- **Long-lived branches**
  - `main`: production-ready, tagged releases only.
  - `develop`: integration branch for all completed features.
- **Short-lived branches**
  - `feature/<short-description>` from `develop`  
    - Example: `feature/setup-repo-structure`
  - `release/<version>` from `develop` (optional, for stabilizing releases)
  - `hotfix/<short-description>` from `main` for urgent production fixes

### Rules

- `main` and `develop` must be **protected**:
  - No direct pushes.
  - All changes go through Pull Requests (PRs).
- Feature branches:
  - Always branch from `develop`.
  - Merge back into `develop` only, via PR.
- Hotfix branches:
  - Branch from `main`.
  - Merge into `main`, then merge `main` back into `develop` to keep them in sync.

## Commit conventions (Conventional Commits)

All commits must follow the **Conventional Commits** format:

```text
<type>(optional scope): <short description>
```

Common types:

- `feat`: a new feature (e.g. `feat(backend): add /health route`)
- `fix`: a bug fix
- `docs`: documentation only changes
- `chore`: tooling, config, or infrastructure changes
- `refactor`: code changes that neither fix a bug nor add a feature
- `test`: adding or updating tests

Additional rules:

- Aim for **small, focused** commits.
- Minimum **5 commits per feature branch** (as required by the project rules).
- Use clear, descriptive messages that explain the **why**, not just the what.

## Pull request process

For every PR:

1. **Target branch**
   - Feature → `develop`
   - Release → `main`
   - Hotfix → `main` (and then sync back into `develop`)
2. **PR title**
   - Use a concise description, e.g. `feat: scaffold repo structure`.
3. **Description**
   - What was changed (high level).
   - Why the change was needed.
   - Any risks, limitations, or follow-ups.
4. **Checks**
   - Ensure tests (when present) pass.
   - Ensure linters/formatters (when configured) pass.
   - Ensure Docker builds and `docker compose up` work for the modified services (when implemented).

## Self-review checklist

Before requesting review:

- **Code & structure**
  - Changes follow the repository structure defined in `devops-foundations.rules.md`.
  - No secrets, passwords, or tokens in code, configs, or Dockerfiles.
  - Environment uses variables and `.env` (never committed), with `.env.example` updated if needed.
- **Git hygiene**
  - Branch named according to GitFlow (`feature/...`, `hotfix/...`, etc.).
  - Commits follow Conventional Commits.
  - No unrelated changes in the same PR.
- **Docs**
  - README and other docs updated if behavior, commands, or architecture changed.

By following these guidelines, we keep the history readable, the repo secure, and the project easy to understand for anyone reviewing it.

