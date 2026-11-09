// Account creation and login for this front-end demo
document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const showPasswordButton = document.getElementById("toggleLoginPassword");

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegisterSubmit);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }

  if (showPasswordButton) {
    showPasswordButton.addEventListener("click", function (event) {
      event.preventDefault();
      togglePasswordVisibility(showPasswordButton);
    });
  }
});

function handleRegisterSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const message = document.getElementById("registerMessage");

  if (password !== confirmPassword) {
    showMessage(message, "The passwords do not match. Please check them.", "error");
    return;
  }

  const users = getUsers();
  const alreadyRegistered = users.some(function (user) {
    return user.email === email;
  });

  if (alreadyRegistered) {
    showMessage(message, "An account with this email already exists. Try logging in.", "error");
    return;
  }

  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: password
  };

  users.push(newUser);
  writeStorageValue("blogspace_users", users);
  writeStorageValue("blogspace_currentUser", {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email
  });

  window.location.href = "dashboard.html";
}

function handleLoginSubmit(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const message = document.getElementById("loginMessage");
  const users = getUsers();

  const foundUser = users.find(function (user) {
    return user.email === email && user.password === password;
  });

  if (!foundUser) {
    showMessage(message, "Email or password is incorrect. Please try again.", "error");
    return;
  }

  writeStorageValue("blogspace_currentUser", {
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email
  });

  window.location.href = "dashboard.html";
}

function togglePasswordVisibility(button) {
  const passwordInput = document.getElementById("loginPassword");

  if (!passwordInput) {
    return;
  }

  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  button.textContent = isHidden ? "Hide password" : "Show password";
}
