// Entry point for the DevOps Foundations dashboard frontend.

const API_BASE = 'https://api.localhost';

function logLoaded() {
  console.info("[dashboard] Frontend loaded and connecting to API...");
}

async function checkBackendStatus() {
  const el = document.getElementById("status-backend");
  if (!el) return;
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) {
      const data = await res.json();
      el.textContent = `✅ Backend : OK (${data.version || '0.2.0'})`;
      el.className = "status status-ok";
    } else {
      throw new Error("HTTP error " + res.status);
    }
  } catch (err) {
    el.textContent = "❌ Backend : DOWN";
    el.className = "status status-down";
    console.error("Backend health check failed:", err);
  }
}

async function checkDbStatus() {
  const el = document.getElementById("status-db");
  if (!el) return;
  try {
    const res = await fetch(`${API_BASE}/db`);
    if (res.ok) {
      el.textContent = "✅ Database : OK";
      el.className = "status status-ok";
    } else {
      throw new Error("HTTP error " + res.status);
    }
  } catch (err) {
    el.textContent = "❌ Database : DOWN";
    el.className = "status status-down";
    console.error("Database check failed:", err);
  }
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