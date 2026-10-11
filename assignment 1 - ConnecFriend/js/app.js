// Shared small helpers used by each page.
function signedIn() {
  if (sessionStorage.getItem("cf-signed-in") !== "yes") {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function escapeText(text) {
  return String(text || "").replace(/[&<>"']/g, function (letter) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[letter];
  });
}

function personById(data, id) {
  if (id === "sarim") return data.me;
  return data.friends.find(function (person) { return person.id === id; });
}

function avatar(person, size) {
  return '<span class="avatar avatar-' + (person.tone || "peach") + " " + (size || "") + '" role="img" aria-label="' + escapeText(person.name) + '">' + escapeText(person.avatar) + "</span>";
}

function timeAgo(minutes) {
  if (minutes < 60) return minutes + " min ago";
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? hours + (hours === 1 ? " hour ago" : " hours ago") : Math.floor(hours / 24) + " days ago";
}

function makeHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const page = document.body.dataset.page;
  const links = [
    ["home", "index.html", "Home"],
    ["people", "people.html", "People"],
    ["messages", "messages.html", "Messages"],
    ["profile", "profile.html", "My profile"]
  ];
  header.innerHTML = '<nav class="main-nav"><a class="brand" href="index.html"><span class="brand-symbol">●●</span> ConnecFriend</a><div class="nav-links">' + links.map(function (link) {
    return '<a class="nav-link ' + (page === link[0] ? "active" : "") + '" href="' + link[1] + '">' + link[2] + "</a>";
  }).join("") + '</div><button class="btn btn-sm btn-outline-secondary signout" id="sign-out">Sign out</button></nav>';
  document.getElementById("sign-out").addEventListener("click", function () {
    sessionStorage.removeItem("cf-signed-in");
    window.location.href = "login.html";
  });
  const resetButton = document.getElementById("reset-demo");
  if (resetButton) resetButton.addEventListener("click", function () {
    try { localStorage.removeItem(DATA_KEY); } catch (error) { sessionStorage.removeItem(DATA_KEY); }
    window.location.reload();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.body.dataset.page && signedIn()) makeHeader();
});
