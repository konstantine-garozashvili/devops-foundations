# Git Strategies: Merge vs Rebase

Lorsqu'on travaille en environnement DevOps de manière collaborative (ex: Flow GitHub/GitFlow), l'intégration de nouvelles fonctionnalités est primordiale. Les deux outils dominants pour réunir l'historique d'une branche `feature` dans la branche `develop` (ou `main`) sont **Git Merge** et **Git Rebase**.

## 1. Git Merge
La commande `git merge` prend deux historiques distincts (branches) et les combine. Si l'historique diverge, Git crée un nouveau **"Commit de fusion"** (Merge Commit) regroupant les deux historiques.

### Avantages :
- **Non destructif** : L'historique des commits existants n'est jamais modifié. Les empreintes SHA-1 des commits restent intactes.
- **Transparence** : Conserve le contexte sémantique exact (quand la branche a divergé et s'est réunifiée).

### Inconvénients :
- L’historique peut rapidement devenir difficile à lire (le fameux "spaghetti graph") avec des dizaines de branches et micro-commits de fusion intermédiaires (ex. `Merge branch develop into feature/xxx`).

### Quand l'utiliser :
- **GitFlow** : Lors de la fusion d'une `feature` vers `develop` ou `develop` vers `main` (par exemple, avec `--no-ff` pour des raisons de traçabilité).
- Lorsque le contexte de la branche est important pour l'audit de code.

---

## 2. Git Rebase
La commande `git rebase` compresse et déplace ou "rejoue" une série de commits d'une branche temporaire (`feature`) au-dessus d'une branche de destination (`develop`).

### Avantages :
- **Historique linéaire** : On obtient un graphe Git parfaitement propre, linéaire, semblable à une unique ligne horizontale claire, sans commit de fusion inutile.
- **Révision fluide** : Facilite la lecture du journal (`git log`) et la détection d'erreurs historiques (`git bisect`).

### Inconvénients :
- **Destructif localement** : Rebase réécrit l’historique. Les commits "rejoués" auront de nouvelles clés SHA-1.
- **Risques de conflit continu** : Les conflits doivent être résolus commit par commit, ce qui peut s'avérer fastidieux.

### Quand l'utiliser :
- **Mise à jour locale** : Idéal pour rapatrier `develop` dans sa `feature` locale avant d'ouvrir sa Pull Request. (*Règle d'or : Ne jamais rebase des commits déjà publiés sur une branche partagée publique, sauf sur sa propre branche PR non collaborative*).
- Pour "nettoyer" sa propre branche (ex: `git rebase -i` pour squasher ses micro-commits avant la review).

## Comparaison Synthétique

| Stratégie | Altère l'Historique local ? | Clarté de l'Historique global  | Cas d'Usage recommandé                                     |
|-----------|------------------------------|--------------------------------|------------------------------------------------------------|
| **Merge** | Non                          | Difficile (branches croisées)  | Intégration / Validation d'une Feature via Pull Request    |
| **Rebase**| Oui (Nouveaux SHA)           | Optimal (linéaire et clair)    | Mise à jour de sa branche depuis `develop` avant un Merge  |

---

## 3. Politique choisie pour ce projet

**Stratégie adoptée : Rebase local + Merge `--no-ff` pour l'intégration.**

### Workflow concret :

1. Le développeur travaille sur sa branche `feature/*` avec des commits atomiques.
2. Avant d'ouvrir une Pull Request, il rebase sa branche sur `develop` :
   ```bash
   git checkout feature/my-feature
   git rebase develop
   ```
   Cela garantit un historique linéaire et facilite la review.
3. La Pull Request est mergée dans `develop` via **merge `--no-ff`** (merge commit explicite) :
   ```bash
   git checkout develop
   git merge --no-ff feature/my-feature
   ```

### Justification technique :

- **Rebase en local** : Maintient un historique propre et linéaire sur chaque branche feature, simplifie `git bisect` et la lecture du log.
- **Merge `--no-ff` à l'intégration** : Préserve la traçabilité des features. Chaque merge commit dans `develop` ou `main` marque clairement le périmètre d'une feature ou d'un fix, ce qui est essentiel pour l'audit et les rollbacks.
- **Règle d'or** : Ne jamais rebase des commits déjà poussés sur une branche partagée (`develop`, `main`). Le rebase reste strictement local à la branche du développeur.

Cette approche hybride combine le meilleur des deux stratégies : la clarté du rebase pour le travail individuel et la traçabilité du merge pour l'historique collaboratif.
