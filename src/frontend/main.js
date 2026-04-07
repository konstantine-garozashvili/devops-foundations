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

async function checkCacheStatus() {
  const el = document.getElementById("status-cache");
  const counterEl = document.getElementById("visit-counter");
  if (!el) return;
  try {
    const res = await fetch(`${API_BASE}/cache`);
    if (res.ok) {
      const data = await res.json();
      el.textContent = "✅ Cache : OK";
      el.className = "status status-ok";
      if (counterEl && data.counter) {
        counterEl.textContent = data.counter;
      }
    } else {
      throw new Error("HTTP error " + res.status);
    }
  } catch (err) {
    el.textContent = "❌ Cache : DOWN";
    el.className = "status status-down";
    console.error("Cache check failed:", err);
  }
}

async function submitContactForm(event) {
  event.preventDefault();
  const resultEl = document.getElementById("contact-result");
  const form = event.target;
  if (!resultEl) return;

  const data = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value
  };

  resultEl.textContent = "Envoi en cours...";
  resultEl.style.color = "inherit";

  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      resultEl.textContent = "✅ Message envoyé avec succès !";
      resultEl.style.color = "green";
      form.reset();
    } else {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Erreur HTTP " + res.status);
    }
  } catch (err) {
    resultEl.textContent = `❌ Erreur : ${err.message}`;
    resultEl.style.color = "red";
  }
}

function setup() {
  logLoaded();

  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", submitContactForm);
  }

  checkBackendStatus();
  checkDbStatus();
  checkCacheStatus();
}

window.addEventListener("DOMContentLoaded", setup);