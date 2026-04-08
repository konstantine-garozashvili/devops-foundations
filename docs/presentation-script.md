# 🎬 DevOps Foundations - Screencast Presentation Script

This document is your step-by-step script for recording the 5-10 minute video demonstration requested in the `DevOps Foundations.md` (Livrable 4.2). It covers the exact flow, the CLI commands to type, and what to say over the microphone to satisfy your CTO.

---

## ⏱ Section 1: Introduction & Git Workflow (2 minutes)

**Goal:** Prove your maturity with Git, branching strategies, and atomic commits.

1. **Start Screen:** Open your terminal at the root of the project.
2. **Action:** Run `git log --graph --oneline --all -n 15`
3. **What to say:**
   > "Bonjour, voici ma démonstration de l'infrastructure DevOps de référence pour CloudNative Labs. 
   > "Avant de lancer les conteneurs, je veux vous montrer mon Workflow Git. J'ai respecté strictement le **GitFlow** avec des branches `main` et `develop` protégées."
   > "Sur mon dernier ticket, la branche `feature/final-verification`, j'ai réalisé **5 commits atomiques** en utilisant les Conventional Commits (`fix:`, `feat:`, `docs:`)."
   > "Vous pouvez également voir ici la démonstration de la stratégie **Rebase vs Merge**. J'ai *rebasé* ma branche `feature` pour garder un historique local linéaire propre après un commit sur `develop`, puis je l'ai fusionnée avec `--no-ff` (le commit `7264a51`) pour garantir la traçabilité complète de mon travail dans l'historique global."

---

## ⏱ Section 2: Code source & Infrastructure Docker (2 minutes)

**Goal:** Show your Dockerfiles, security, and multi-environment setup.

1. **Action:** Open VS Code (or `cat`) and briefly show `src/frontend/Dockerfile` and `docker-compose.yml`.
2. **What to say:**
   > "Pour la conteneurisation, les services Backend et Frontend utilisent des **Multi-stage builds**. Je compile l'application, puis je transfère uniquement les binaires dans une image `alpine` minimale."
   > "Côté sécurité, je n'utilise jamais l'utilisateur root. J'ai configuré un `appuser` restreint."
   > "Dans le `docker-compose.yml`, j'ai architecturé des **réseaux stricts**. Traefik est le *seul* à exposer les ports 80 et 443. Les bases de données (`PostgreSQL` et `Redis`) sont isolées sur le sous-réseau privé `backend`."

---

## ⏱ Section 3: Initialisation & Reverse Proxy Traefik (2 minutes)

**Goal:** Boot the environment, demonstrate mkcert TLS, and show the services online.

1. **Action:** Run `./scripts/generate-certs.sh` (to show mkcert in action) then `docker compose up -d`.
2. **What to say:**
   > "Maintenant, je démarre l'infrastructure. Un script génère au préalable les certificats locaux avec `mkcert`."
   > "L'orchestrateur déploie l'architecture configurée avec les healthchecks."
3. **Action:** Open your browser.
4. **What to say:** 
   > "Grâce à la découverte dynamique de Traefik (Docker Provider) et aux labels, tout mon routage est géré sans redémarrage."
   - **Navigate to `https://app.localhost`** ➔ *"Le frontend est accessible en HTTPS, avec un HSTS actif via les middlewares Traefik."*
   - **Navigate to `https://api.localhost/health`** ➔ *"Mon backend API est fonctionnel et protégé par un Rate Limiting."*
   - **Navigate to `https://db.localhost`** ➔ *"L'accès à Adminer demande une Basic Auth. Les identifiants sont injectés via `.env` et jamais versionnés en clair."*

---

## ⏱ Section 4: Load Balancing (1 minute)

**Goal:** Show that Traffic distributes the workload across 2 backend replicas.

1. **Action:** Go to `https://app.localhost` or use `curl -k https://api.localhost/`.
2. **Action:** Look at the "Node ID" or refresh the page multiple times.
3. **What to say:**
   > "Dans le `docker-compose.prod.yml`, nous avons configuré `replicas: 2` pour le Backend applicatif."
   > "En rafraîchissant l'API locale, on peut constater que les requêtes sont interceptées en Load Balancing par Traefik en *Round Robin* sur les deux conteneurs cibles."

---

## ⏱ Section 5: Shut Down & Persistance des données (2 minutes)

**Goal:** Prove that databases don't lose data on container destruction.

1. **Action:** On `https://app.localhost`, show the "Compteur de visites" (which has augmented via Redis) and database connection.
2. **Action:** In terminal, run `docker compose down`.
3. **What to say:**
   > "Je détruis maintenant complètement l'infrastructure."
4. **Action:** Run `docker compose up -d` again. Wait 5 seconds for healthchecks.
5. **Action:** Refresh the dashboard page.
6. **What to say:**
   > "Je relance l'infrastructure... Comme vous le voyez à la reconnexion, le compteur Redis et les données Postgres ont **persisté**. C'est garanti par mes Volumes Nommés Docker (`postgres_data`, `redis_data`) qui sont physiquement découplés de la destruction des conteneurs."
   > "Merci beaucoup."
