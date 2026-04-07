# Contributing to DevOps Foundations

Thank you for your interest in contributing to this project! This document outlines the workflow and conventions we follow.

## Branching Strategy (GitFlow)

### Main Branches

- **main**: Production-ready code. Protected branch - requires pull request approval.
- **develop**: Integration branch for features. Protected branch - requires pull request approval.

### Supporting Branches

- **feature/***: New features (branched from develop, merged back to develop)
- **bugfix/***: Bug fixes (branched from develop, merged back to develop)
- **hotfix/***: Urgent production fixes (branched from main, merged to main and develop)
- **release/***: Release preparation (branched from develop, merged to main and develop)

### Workflow

1. **Start a new feature**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Work on your feature** with atomic commits

3. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** to develop branch

5. **Code Review**: At least 1 approval required

6. **Merge**: Once approved, merge to develop

## Commit Conventions (Conventional Commits)

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>: <description>

[optional body]

[optional footer]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, semicolons, etc)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, config, etc)
- **build**: Build system changes
- **ci**: CI/CD changes

### Examples

```
feat: add Traefik reverse proxy configuration

fix: resolve PostgreSQL connection timeout

docs: update README with installation steps

chore: update Node.js dependencies
```

### Commit Best Practices

- Write clear, concise commit messages
- Use present tense ("add feature" not "added feature")
- Keep commits atomic (one logical change per commit)
- Minimum 5 commits per feature branch
- Reference issues when applicable (#123)

## Code Review Process

1. Create a Pull Request with:
   - Clear title and description
   - Reference to related issues
   - Screenshots if UI changes

2. Request review from team members

3. Address review feedback

4. Obtain at least 1 approval

5. Merge using the appropriate strategy (see below)

## Self-Review Checklist

Before requesting a review, verify every item below:

- [ ] **Commits** follow Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`)
- [ ] **Branch** is named correctly (`feature/`, `bugfix/`, `hotfix/`, `release/`)
- [ ] **No credentials** or secrets in any committed file (`.env` is gitignored)
- [ ] **Dockerfiles** use multi-stage builds, non-root user, HEALTHCHECK, and OCI labels
- [ ] **No `|| true`** masking errors in Dockerfile RUN commands
- [ ] **No application ports** exposed directly — all traffic goes through Traefik
- [ ] **Health checks** are defined for every service in `docker-compose.yml`
- [ ] **Named volumes** used for persistent data (no anonymous volumes)
- [ ] **Network isolation** respected: PostgreSQL and Redis only on `backend` network
- [ ] **Security headers** present on all routes (HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- [ ] **`docker compose up`** runs without errors and all services reach healthy state
- [ ] **Documentation** updated if behaviour or configuration changed
- [ ] **No unrelated changes** mixed into the PR

## Branch Protection

- **main** and **develop** branches are protected
- Direct pushes are not allowed
- Pull requests must be approved before merging
- All status checks must pass

## Questions?

If you have any questions about the contribution process, please open an issue or contact the maintainers.
