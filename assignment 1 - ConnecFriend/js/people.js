document.addEventListener("DOMContentLoaded", function () {
  if (!signedIn()) return;
  const data = getData();
  const notice = document.getElementById("people-notice");

  function drawFriends() {
    const friends = data.friends.filter(function (person) { return person.isFriend; }).sort(function (a, b) { return a.lastLogin - b.lastLogin; });
    document.getElementById("friend-count").textContent = friends.length + " friends";
    document.getElementById("friend-list").innerHTML = friends.map(function (person) {
      return '<div class="col-md-6"><article class="person-card"><a class="person-card-link" href="profile.html?id=' + person.id + '">' + avatar(person, "avatar-medium") + '<span><strong>' + escapeText(person.name) + '</strong><small>Here ' + timeAgo(person.lastLogin) + '</small><small>' + escapeText(person.interest) + '</small></span><span class="arrow-link">→</span></a><a class="small message-link" href="messages.html?person=' + person.id + '">Send a message</a></article></div>';
    }).join("");
  }

  function drawSuggestions() {
    const people = data.friends.filter(function (person) { return !person.isFriend; });
    document.getElementById("suggestions").innerHTML = people.map(function (person) {
      const request = data.requests.find(function (item) { return item.id === person.id; });
      let button = '<button class="btn btn-sm btn-outline-primary" data-invite="' + person.id + '">Connect +</button>';
      if (person.ignoresMe) button = '<button class="btn btn-sm btn-light" disabled title="This person is not accepting your request">Unavailable</button>';
      else if (request && request.status === "incoming") button = '<span class="small text-secondary">Request waiting</span>';
      else if (request && request.status === "sent") button = '<button class="btn btn-sm btn-light" disabled>Request sent</button>';
      return '<div class="col-md-6 col-xl-4"><article class="suggestion-card"><a class="person-card-link" href="profile.html?id=' + person.id + '">' + avatar(person, "avatar-medium") + '<span><strong>' + escapeText(person.name) + '</strong><small>Class of ' + escapeText(person.year) + '</small></span></a><p>' + escapeText(person.bio) + '</p><div class="suggestion-bottom"><span class="interest-chip">' + escapeText(person.interest) + '</span>' + button + '</div></article></div>';
    }).join("") || '<div class="col"><p class="text-secondary">You have met everyone in this little demo.</p></div>';
  }

  function drawRequests() {
    const requests = data.requests.filter(function (item) { return item.status === "incoming"; });
    document.getElementById("request-list").innerHTML = requests.map(function (item) {
      const person = personById(data, item.id);
      return '<div class="request-person"><a href="profile.html?id=' + person.id + '">' + avatar(person, "avatar-small") + '</a><div class="flex-grow-1"><strong>' + escapeText(person.name) + '</strong><small>Would like to connect</small></div><button class="btn btn-sm btn-primary" data-accept="' + person.id + '">Accept</button><button class="btn btn-sm btn-light" data-decline="' + person.id + '">Decline</button></div>';
    }).join("") || '<p class="text-secondary small mb-0">No requests waiting right now.</p>';
  }

  document.getElementById("suggestions").addEventListener("click", function (event) {
    const button = event.target.closest("[data-invite]");
    if (!button) return;
    const person = personById(data, button.dataset.invite);
    if (person.ignoresMe) {
      notice.textContent = "This person is not accepting friend requests from you.";
      notice.classList.remove("d-none");
      return;
    }
    data.requests.push({ id: person.id, status: "sent" });
    saveData(data);
    drawSuggestions();
    notice.textContent = "Your friend request was sent to " + person.name + ".";
    notice.classList.remove("d-none");
  });

  document.getElementById("request-list").addEventListener("click", function (event) {
    const accept = event.target.closest("[data-accept]");
    const decline = event.target.closest("[data-decline]");
    if (accept) {
      const person = personById(data, accept.dataset.accept);
      person.isFriend = true;
      data.requests.find(function (item) { return item.id === person.id && item.status === "incoming"; }).status = "accepted";
      saveData(data); drawFriends(); drawRequests(); drawSuggestions();
      notice.textContent = "You and " + person.name + " are now friends.";
      notice.classList.remove("d-none");
    }
    if (decline) {
      data.requests.find(function (item) { return item.id === decline.dataset.decline && item.status === "incoming"; }).status = "declined";
      saveData(data); drawRequests();
    }
  });

  drawFriends(); drawSuggestions(); drawRequests();
});
