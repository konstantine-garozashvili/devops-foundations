// Entry point for the DevOps Foundations dashboard frontend.
// The real API calls will be implemented in a later feature.

function logLoaded() {
  // Simple marker in the console so we can confirm the frontend is served correctly.
  console.info("[dashboard] Page chargée (placeholder).");
}

function checkBackendStatus() {
  // TODO: appeler GET /health sur l'API backend (https://api.localhost/health via Traefik).
  // Pour le moment, on laisse le statut à \"Inconnu\".
}

function checkDbStatus() {
  // TODO: appeler GET /db sur l'API backend pour vérifier la connexion PostgreSQL.
}

function checkCacheStatus() {
  // TODO: appeler GET /cache sur l'API backend pour récupérer et incrémenter le compteur de visites Redis.
}

function submitContactForm(event) {
  event.preventDefault();
  const resultEl = document.getElementById("contact-result");
  if (!resultEl) return;

  // TODO: envoyer les données du formulaire en POST /contact sur l'API backend.
  resultEl.textContent =
    "Envoi du formulaire simulé. L'intégration réelle sera ajoutée plus tard.";
}

function setup() {
  logLoaded();

  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", submitContactForm);
  }

  // Appels vers les fonctions de statut (placeholder pour l'instant).
  checkBackendStatus();
  checkDbStatus();
  checkCacheStatus();
}

window.addEventListener("DOMContentLoaded", setup);