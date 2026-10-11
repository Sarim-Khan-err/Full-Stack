document.addEventListener("DOMContentLoaded", function () {
  if (!signedIn()) return;
  const data = getData();
  let selectedId = "";
  const contactList = document.getElementById("contact-list");

  function drawContacts() {
    const friends = data.friends.slice().sort(function (a, b) {
      if (a.isFriend !== b.isFriend) return a.isFriend ? -1 : 1;
      return a.lastLogin - b.lastLogin;
    });
    contactList.innerHTML = friends.map(function (person) {
      const messages = data.messages[person.id] || [];
      const lastMessage = messages.length ? messages[messages.length - 1].text : "Start a conversation";
      return '<button class="contact-button ' + (selectedId === person.id ? "active" : "") + '" data-contact="' + person.id + '">' + avatar(person, "avatar-small") + '<span><strong>' + escapeText(person.name) + '</strong><small>' + escapeText(lastMessage) + '</small></span><small class="contact-type">' + (person.isFriend ? "Friend" : "Member") + '</small></button>';
    }).join("");
  }

  function openConversation(id) {
    const person = personById(data, id);
    if (!person) return;
    selectedId = id;
    document.getElementById("chat-empty").classList.add("d-none");
    document.getElementById("chat-window").classList.remove("d-none");
    document.getElementById("chat-heading").innerHTML = avatar(person, "avatar-small") + '<div><a class="author-name" href="profile.html?id=' + person.id + '">' + escapeText(person.name) + '</a><small>' + (person.isFriend ? "Your private conversation" : "Private message · ConnecFriend member") + '</small></div><a class="ms-auto text-link small" href="profile.html?id=' + person.id + '">View profile →</a>';
    const messages = data.messages[id] || [];
    document.getElementById("chat-messages").innerHTML = messages.map(function (message) {
      return '<div class="message-row"><span class="message-bubble">' + escapeText(message.text) + '</span><small>You · ' + new Date(message.time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + "</small></div>";
    }).join("") || '<p class="empty-chat-note">No notes yet. You can start with a hello.</p>';
    document.getElementById("chat-messages").scrollTop = document.getElementById("chat-messages").scrollHeight;
    drawContacts();
  }

  contactList.addEventListener("click", function (event) {
    const button = event.target.closest("[data-contact]");
    if (button) openConversation(button.dataset.contact);
  });

  document.getElementById("message-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const field = document.getElementById("message-text");
    const text = field.value.trim();
    if (!text || !selectedId) return;
    if (!data.messages[selectedId]) data.messages[selectedId] = [];
    data.messages[selectedId].push({ text: text, time: Date.now() });
    try { saveData(data); }
    catch (error) {
      data.messages[selectedId].pop();
      const messageError = document.getElementById("message-error");
      messageError.textContent = "This browser is out of storage. Clear the demo and try again.";
      messageError.classList.remove("d-none");
      return;
    }
    field.value = "";
    document.getElementById("message-error").classList.add("d-none");
    openConversation(selectedId);
  });

  drawContacts();
  const linkedPerson = new URLSearchParams(window.location.search).get("person");
  if (linkedPerson) openConversation(linkedPerson);
});
