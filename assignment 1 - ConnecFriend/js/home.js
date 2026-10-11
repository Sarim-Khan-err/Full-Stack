document.addEventListener("DOMContentLoaded", function () {
  if (!signedIn()) return;
  const data = getData();
  const me = data.me;
  const audienceOptions = document.getElementById("audience-options");
  audienceOptions.innerHTML = '<label><input type="checkbox" name="audience" value="all" checked> All friends</label>' + data.friends.filter(function (person) { return person.isFriend; }).map(function (person) {
    return '<label><input type="checkbox" name="audience" value="' + person.id + '"> ' + escapeText(person.name) + "</label>";
  }).join("");
  const allFriendsBox = audienceOptions.querySelector('[value="all"]');
  const friendBoxes = audienceOptions.querySelectorAll('[name="audience"]:not([value="all"])');
  function updateAudienceLabel() {
    const selected = Array.from(friendBoxes).filter(function (box) { return box.checked; }).map(function (box) { return personById(data, box.value).name; });
    document.getElementById("audience-summary").textContent = allFriendsBox.checked ? "All friends⌄" : (selected.join(", ") || "Choose friends⌄");
  }
  audienceOptions.addEventListener("change", function (event) {
    if (event.target.value === "all" && allFriendsBox.checked) friendBoxes.forEach(function (box) { box.checked = false; });
    if (event.target.value !== "all" && event.target.checked) allFriendsBox.checked = false;
    if (!allFriendsBox.checked && !Array.from(friendBoxes).some(function (box) { return box.checked; })) allFriendsBox.checked = true;
    updateAudienceLabel();
  });
  function selectedAudience() {
    if (allFriendsBox.checked) return "All friends";
    return Array.from(friendBoxes).filter(function (box) { return box.checked; }).map(function (box) { return personById(data, box.value).name; }).join(", ");
  }

  function drawFriends() {
    const friends = data.friends.filter(function (person) { return person.isFriend; }).sort(function (a, b) { return a.lastLogin - b.lastLogin; });
    document.getElementById("recent-friends").innerHTML = friends.map(function (person) {
      const rating = data.ratings[person.id] || 0;
      return '<article class="person-peek"><a class="person-peek-face" href="profile.html?id=' + person.id + '" aria-label="View ' + escapeText(person.name) + '\'s profile">' + avatar(person, "avatar-medium") + '</a><a class="person-peek-name" href="profile.html?id=' + person.id + '">' + escapeText(person.name.split(" ")[0]) + '</a><small class="person-peek-time">Seen ' + timeAgo(person.lastLogin) + '</small><div class="person-peek-actions"><a href="messages.html?person=' + person.id + '" aria-label="Message ' + escapeText(person.name) + '" title="Message">✉</a><details class="rate-details"><summary title="Rate friend">' + (rating ? "★ Rated" : "☆ Rate") + '</summary><div class="rate-options"><strong>Rate ' + escapeText(person.name.split(" ")[0]) + '</strong><div class="d-flex gap-1 mt-2"><button data-rate="' + person.id + '" data-value="1" class="rate-option ' + (rating === 1 ? "chosen" : "") + '" title="Stupid">😵<small>Stupid</small></button><button data-rate="' + person.id + '" data-value="2" class="rate-option ' + (rating === 2 ? "chosen" : "") + '" title="Cool">⭐<small>Cool</small></button><button data-rate="' + person.id + '" data-value="3" class="rate-option ' + (rating === 3 ? "chosen" : "") + '" title="Trustworthy">🛡️<small>Trustworthy</small></button></div></div></details></div></article>';
    }).join("") || '<p class="small text-secondary">Your friends will appear here.</p>';
  }

  function drawPosts() {
    const posts = data.posts.filter(function (post) {
      return post.author === "sarim" || post.audience === "All friends" || post.audience === "sarim";
    }).sort(function (a, b) {
      if (a.author === "sarim") return -1;
      if (b.author === "sarim") return 1;
      return personById(data, a.author).lastLogin - personById(data, b.author).lastLogin;
    });
    document.getElementById("feed").innerHTML = posts.map(function (post) {
      const author = personById(data, post.author);
      const isOwn = post.author === "sarim";
      const visual = post.image ? '<img class="post-photo" src="' + post.image + '" alt="Photo shared by ' + escapeText(author.name) + '">' : (post.art ? '<div class="post-art" role="img" aria-label="' + escapeText(post.artLabel) + '"><span>' + escapeText(post.art) + '</span><small>' + escapeText(post.artLabel) + "</small></div>" : "");
      const audienceLabel = post.audience === "All friends" ? "All friends" : "Shared with " + post.audience;
      return '<article class="post-card ' + (post.art ? "post-card-featured" : "post-card-note") + (post.id === 2 ? " post-card-peach" : "") + '"><div class="post-author"><a href="profile.html' + (isOwn ? "" : "?id=" + author.id) + '">' + avatar(author, "avatar-medium") + '</a><div class="flex-grow-1"><a class="author-name" href="profile.html' + (isOwn ? "" : "?id=" + author.id) + '">' + escapeText(author.name) + '</a><small>' + (isOwn ? "You · just now" : "Posted " + timeAgo(post.minutesAgo)) + '</small></div><span class="post-mark" aria-hidden="true">✳</span></div><p class="post-text">' + escapeText(post.text) + '</p>' + visual + '<div class="post-footer"><div class="d-flex gap-2"><button class="reaction ' + (post.myReaction === "like" ? "reaction-active" : "") + '" data-react="like" data-id="' + post.id + '" aria-pressed="' + (post.myReaction === "like") + '">♡ <span>Like</span> ' + post.likes + '</button><button class="reaction ' + (post.myReaction === "dislike" ? "reaction-active" : "") + '" data-react="dislike" data-id="' + post.id + '" aria-pressed="' + (post.myReaction === "dislike") + '">⌁ <span>Dislike</span> ' + post.dislikes + '</button></div><span class="post-audience">♧ ' + escapeText(audienceLabel) + '</span></div></article>';
    }).join("") || '<div class="content-panel empty-state"><span>🌷</span><h2>Your feed is waiting.</h2><p>Invite a friend or share the first little update.</p></div>';
  }

  function drawRequests() {
    const pending = data.requests.filter(function (request) { return request.status === "incoming"; });
    document.getElementById("request-count").textContent = pending.length || "";
    document.getElementById("request-panel").classList.toggle("d-none", pending.length === 0);
    document.getElementById("requests").innerHTML = pending.map(function (request) {
      const person = personById(data, request.id);
      return '<div class="request-person">' + avatar(person, "avatar-small") + '<div class="flex-grow-1"><strong>' + escapeText(person.name) + '</strong><small>Would like to connect</small></div><div class="request-buttons"><button class="btn btn-sm btn-primary" data-accept="' + person.id + '">Accept</button><button class="btn btn-sm btn-light" data-decline="' + person.id + '">Decline</button></div></div>';
    }).join("");
  }

  document.getElementById("feed").addEventListener("click", function (event) {
    const button = event.target.closest("[data-react]");
    if (!button) return;
    const post = data.posts.find(function (item) { return String(item.id) === button.dataset.id; });
    const chosen = button.dataset.react;
    if (!post) return;
    if (post.myReaction === chosen) {
      post[chosen === "like" ? "likes" : "dislikes"]--;
      post.myReaction = "";
    } else {
      if (post.myReaction) post[post.myReaction === "like" ? "likes" : "dislikes"]--;
      post[chosen === "like" ? "likes" : "dislikes"]++;
      post.myReaction = chosen;
    }
    saveData(data);
    drawPosts();
  });

  document.getElementById("recent-friends").addEventListener("click", function (event) {
    const button = event.target.closest("[data-rate]");
    if (!button) return;
    data.ratings[button.dataset.rate] = Number(button.dataset.value);
    saveData(data);
    drawFriends();
  });

  document.getElementById("requests").addEventListener("click", function (event) {
    const accept = event.target.closest("[data-accept]");
    const decline = event.target.closest("[data-decline]");
    if (accept) {
      const friend = personById(data, accept.dataset.accept);
      friend.isFriend = true;
      data.requests.find(function (request) { return request.id === friend.id; }).status = "accepted";
      saveData(data); drawFriends(); drawRequests(); drawPosts();
    }
    if (decline) {
      data.requests.find(function (request) { return request.id === decline.dataset.decline; }).status = "declined";
      saveData(data); drawRequests();
    }
  });

  document.getElementById("share-post").addEventListener("click", function () {
    const text = document.getElementById("post-text").value.trim();
    const file = document.getElementById("post-image").files[0];
    const audienceLabel = selectedAudience();
    const error = document.getElementById("post-error");
    if (!text && !file) { error.textContent = "Add a few words or choose a photo before you share."; error.classList.remove("d-none"); return; }
    if (!audienceLabel) { error.textContent = "Choose all friends or at least one person to share with."; error.classList.remove("d-none"); return; }
    if (file && file.size > 600000) { error.textContent = "Choose a photo smaller than 600 KB for this demo."; error.classList.remove("d-none"); return; }
    function addPost(image) {
      data.posts.push({ id: Date.now(), author: "sarim", text: text, art: "", artLabel: "", image: image, likes: 0, dislikes: 0, myReaction: "", audience: audienceLabel, minutesAgo: 0 });
      try { saveData(data); }
      catch (problem) { error.textContent = "This browser is out of storage. Try sharing text without a photo."; error.classList.remove("d-none"); data.posts.pop(); return; }
      document.getElementById("post-text").value = "";
      document.getElementById("post-image").value = "";
      error.classList.add("d-none"); drawPosts();
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = function () { addPost(reader.result); };
      reader.onerror = function () { error.textContent = "That photo could not be read. Choose another one."; error.classList.remove("d-none"); };
      reader.readAsDataURL(file);
    } else addPost("");
  });

  drawFriends();
  drawPosts();
  drawRequests();
});

