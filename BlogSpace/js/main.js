// Shared helpers used by the pages
document.addEventListener("DOMContentLoaded", function () {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  updateNavigation();
});

function readStorageValue(key, fallback) {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue === null ? fallback : JSON.parse(storedValue);
  } catch (error) {
    console.warn("Could not parse localStorage data for key:", key, error);
    return fallback;
  }
}

function writeStorageValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  return readStorageValue("blogspace_users", []);
}

function getCurrentUser() {
  return readStorageValue("blogspace_currentUser", null);
}

function updateNavigation() {
  const navActions = document.getElementById("navActions");
  const user = getCurrentUser();

  if (navActions && user) {
    navActions.innerHTML = '<a class="login-link" href="dashboard.html">My dashboard</a><a class="button button-small" href="create-blog.html">Write a story ↗</a>';
  }
}

function showMessage(element, message, type) {
  if (!element) return;

  element.textContent = message;
  element.className = "form-message show " + type;
}
