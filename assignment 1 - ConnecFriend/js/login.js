document.addEventListener("DOMContentLoaded", function () {
  if (sessionStorage.getItem("cf-signed-in") === "yes") {
    window.location.href = "index.html";
    return;
  }
  document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const error = document.getElementById("login-error");
    if (!username || !password) {
      error.textContent = "Enter your username and password to continue.";
      error.classList.remove("d-none");
    } else if (username !== "sarim" || password !== "meadow123") {
      error.textContent = "That demo sign-in did not match. Try sarim and meadow123.";
      error.classList.remove("d-none");
    } else {
      sessionStorage.setItem("cf-signed-in", "yes");
      window.location.href = "index.html";
    }
  });
});
