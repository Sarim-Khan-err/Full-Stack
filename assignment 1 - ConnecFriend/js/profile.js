document.addEventListener("DOMContentLoaded", function () {
  if (!signedIn()) return;
  const data = getData();
  const id = new URLSearchParams(window.location.search).get("id");
  const ownProfile = !id || id === "sarim";
  const person = ownProfile ? data.me : personById(data, id);
  const actions = document.getElementById("profile-actions");

  if (!person) {
    document.getElementById("profile-name").textContent = "We couldn't find that profile.";
    document.getElementById("profile-details").innerHTML = '<p class="text-secondary">Go back to your people list to choose someone else.</p>';
    return;
  }

  document.title = person.name + " · ConnecFriend";
  document.getElementById("profile-avatar").innerHTML = avatar(person, "avatar-large");
  document.getElementById("profile-name").textContent = person.name;
  document.getElementById("profile-handle").textContent = ownProfile ? "@" + person.username + " · Roll no. " + person.roll : "Class of " + person.year + " · Here " + timeAgo(person.lastLogin);
  document.getElementById("profile-label").textContent = ownProfile ? "YOUR PROFILE" : "A FRIENDLY INTRODUCTION";
  document.getElementById("about-name").textContent = ownProfile ? "me" : person.name.split(" ")[0];
  document.getElementById("profile-details").innerHTML = '<div><dt>About me</dt><dd>' + escapeText(person.bio) + '</dd></div><div><dt>Favourite thing</dt><dd>' + escapeText(person.interest) + '</dd></div><div><dt>At Air University</dt><dd>Class of ' + escapeText(person.year) + '</dd></div>' + (ownProfile ? '<div><dt>Roll number</dt><dd>' + escapeText(person.roll) + '</dd></div>' : "");

  if (ownProfile) {
    actions.innerHTML = '<span class="profile-note">A little about you</span>';
    document.getElementById("profile-friends").innerHTML = data.friends.filter(function (friend) { return friend.isFriend; }).map(function (friend) {
      return '<a class="profile-friend" href="profile.html?id=' + friend.id + '">' + avatar(friend, "avatar-small") + '<span><strong>' + escapeText(friend.name) + '</strong><small>Here ' + timeAgo(friend.lastLogin) + '</small></span><span class="arrow-link">→</span></a>';
    }).join("");
  } else {
    const requestSent = data.requests.some(function (item) { return item.id === person.id && item.status === "sent"; });
    const requestWaiting = data.requests.some(function (item) { return item.id === person.id && item.status === "incoming"; });
    actions.innerHTML = '<a class="btn btn-primary" href="messages.html?person=' + person.id + '">Message ' + escapeText(person.name.split(" ")[0]) + ' ↗</a>' + (person.isFriend ? '<span class="friend-badge">Your friend</span>' : (person.ignoresMe ? '<button class="btn btn-light" disabled>Unavailable</button>' : (requestWaiting ? '<a class="btn btn-outline-primary" href="people.html">Reply to request</a>' : (requestSent ? '<button class="btn btn-light" disabled>Request sent</button>' : '<button class="btn btn-outline-primary" id="profile-invite">Connect +</button>'))));
    const rating = data.ratings[person.id] || 0;
    document.getElementById("friend-rating").innerHTML = person.isFriend ? '<p class="eyebrow mb-2">YOUR PRIVATE FRIEND RATING</p><div class="rating-picks"><button class="rate-option ' + (rating === 1 ? "chosen" : "") + '" data-rate="1">😵<small>Stupid</small></button><button class="rate-option ' + (rating === 2 ? "chosen" : "") + '" data-rate="2">⭐<small>Cool</small></button><button class="rate-option ' + (rating === 3 ? "chosen" : "") + '" data-rate="3">🛡️<small>Trustworthy</small></button></div><p class="small text-secondary mt-2 mb-0" id="rating-saved">' + (rating ? "Your rating: " + ["", "Stupid", "Cool", "Trustworthy"][rating] : "Only you can see your rating.") + '</p>' : '<p class="small text-secondary mb-0">Friend ratings are available after you connect.</p>';
    const inviteButton = actions.querySelector("#profile-invite");
    if (inviteButton) inviteButton.addEventListener("click", function () {
      if (person.ignoresMe) return;
      data.requests.push({ id: person.id, status: "sent" }); saveData(data);
      this.textContent = "Request sent"; this.disabled = true;
    });
    document.getElementById("friend-rating").addEventListener("click", function (event) {
      const button = event.target.closest("[data-rate]");
      if (!button) return;
      data.ratings[person.id] = Number(button.dataset.rate); saveData(data);
      this.querySelectorAll("[data-rate]").forEach(function (option) { option.classList.toggle("chosen", option === button); });
      document.getElementById("rating-saved").textContent = "Your rating: " + ["", "Stupid", "Cool", "Trustworthy"][data.ratings[person.id]];
    });
    document.getElementById("profile-friends").innerHTML = '<p class="small text-secondary">' + escapeText(person.name.split(" ")[0]) + " is part of your ConnecFriend community." + "</p>";
  }
});
