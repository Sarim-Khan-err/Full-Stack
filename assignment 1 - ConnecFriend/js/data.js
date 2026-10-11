// One demo member and a few example friends. There are no other logins.
const DATA_KEY = "connecfriend-simple-demo";

const START_DATA = {
  me: { id: "sarim", name: "Mohammad Sarim Khan", username: "sarim", roll: "241851", bio: "A computer science student who likes long walks and good coffee.", year: "2026", interest: "Coffee, walks, and good company", avatar: "🧑🏽‍🎓", tone: "lilac" },
  friends: [
    { id: "ayesha", name: "Ayesha Khan", bio: "Usually found in the library, looking for my next favourite book.", year: "2025", interest: "Reading", avatar: "👩🏽‍🎨", tone: "peach", lastLogin: 8, isFriend: true, ignoresMe: false },
    { id: "zain", name: "Zain Ahmed", bio: "Taking the scenic route, even when I'm late.", year: "2025", interest: "Photography", avatar: "🧑🏽‍🦱", tone: "yellow", lastLogin: 22, isFriend: true, ignoresMe: false },
    { id: "nina", name: "Nina Patel", bio: "Design, chai, and conversations that run a little long.", year: "2026", interest: "Sketching", avatar: "👩🏻‍💻", tone: "pink", lastLogin: 61, isFriend: true, ignoresMe: false },
    { id: "omar", name: "Omar Ali", bio: "Curious about how people make things together.", year: "2024", interest: "Football", avatar: "🧑🏽‍🏫", tone: "sky", lastLogin: 180, isFriend: true, ignoresMe: false },
    { id: "mariam", name: "Mariam Shah", bio: "A quiet morning and a green campus make my day.", year: "2025", interest: "Gardening", avatar: "👩🏻‍🌾", tone: "mint", lastLogin: 220, isFriend: false, ignoresMe: false },
    { id: "hamza", name: "Hamza Raza", bio: "Always up for a new place to eat after class.", year: "2024", interest: "Food spots", avatar: "🧑🏻‍🍳", tone: "lilac", lastLogin: 290, isFriend: false, ignoresMe: false },
    { id: "noor", name: "Noor Siddiqui", bio: "Collecting little moments in my camera roll.", year: "2026", interest: "Photography", avatar: "👩🏽‍🎤", tone: "peach", lastLogin: 340, isFriend: false, ignoresMe: true }
  ],
  posts: [
    { id: 1, author: "ayesha", text: "Finally finished this little weekend project. Pretty happy with how it turned out.", art: "☕", artLabel: "A colourful handmade mug", likes: 24, dislikes: 2, myReaction: "", audience: "All friends", minutesAgo: 12 },
    { id: 2, author: "zain", text: "Anyone up for a coffee after the afternoon lecture?", art: "", artLabel: "", likes: 8, dislikes: 0, myReaction: "", audience: "All friends", minutesAgo: 34 },
    { id: 3, author: "nina", text: "The light on the walk back from class was especially lovely today.", art: "🌼", artLabel: "A little flower", likes: 16, dislikes: 1, myReaction: "", audience: "All friends", minutesAgo: 60 }
  ],
  requests: [{ id: "mariam", status: "incoming" }],
  ratings: {},
  messages: {}
};

function getData() {
  let saved = "";
  try { saved = localStorage.getItem(DATA_KEY); }
  catch (error) { saved = sessionStorage.getItem(DATA_KEY); }
  if (saved) {
    try { return JSON.parse(saved); }
    catch (error) {
      try { localStorage.removeItem(DATA_KEY); } catch (problem) { sessionStorage.removeItem(DATA_KEY); }
    }
  }
  saveData(START_DATA);
  return JSON.parse(JSON.stringify(START_DATA));
}

function saveData(data) {
  const text = JSON.stringify(data);
  try { localStorage.setItem(DATA_KEY, text); }
  catch (error) { sessionStorage.setItem(DATA_KEY, text); }
}
