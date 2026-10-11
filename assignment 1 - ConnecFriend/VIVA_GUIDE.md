# ConnecFriend — viva guide

## A short introduction

> “ConnecFriend is a browser-only prototype of a campus social network. I built the pages with HTML, used Bootstrap for layout, and used plain JavaScript for the interactions. There are no server calls, as the assignment requested. One demo account can post, react, send friend requests, rate friends, and keep local message notes.”

Open `login.html` and use `sarim` / `meadow123`. On Home, point out the friend order, share a short text update, and press Like twice to show the count go up and back down. On People, accept Mariam's request and try to invite Noor to show the ignore rule. Open Zain's profile and use its Message button, send a note, then return to his profile and open the conversation again to show the note is still there. The note stays in Sarim's browser conversation; no second account receives it. Finish with the My profile page and show the friends list. Use **Reset demo data** to restore the starting examples.

## File map

| File | Purpose |
| --- | --- |
| `login.html` | Sign-in page. |
| `index.html` | Social home page with a playful illustrated cat, composer, friends strip, feed, and incoming request. |
| `people.html` | Friends, suggested members, and friend requests. |
| `profile.html` | Sarim's profile or a friend's profile when opened from a link. |
| `messages.html` | A list of people and the selected local conversation. |
| `js/data.js` | One demo member, sample friends, posts, and starting request. |
| `js/app.js` | Shared navigation, sign-in check, avatar, and text helper. |
| `js/login.js` | Checks the demo username and password. |
| `js/home.js` | Feed display, share, likes, dislikes, ratings, and request actions. |
| `js/people.js` | Friend profiles, invitations, acceptance, and ignore rule. |
| `js/profile.js` | Shows a profile and opens its conversation. |
| `js/messages.js` | Saves and shows notes in the current browser. |
| `css/bootstrap.min.css` | Bootstrap's local stylesheet for page layout and controls. |
| `css/style.css` | The shared styles and the colorful, hand-made town-square theme on Home. |
| `concepts/approved-mockup.png` | The visual direction used for the app. |

## Common viva questions

### What is the cat illustration?

It is a small decorative SVG drawn directly in `index.html` using a few simple shapes and lines. It does not affect the app data or any button behavior. `aria-hidden="true"` tells screen readers to skip this decoration.

### What is meant by no server calls?

The browser runs the pages and keeps the sample state on this computer. The app does not send a request to a server or use a shared database.

### Why is there only one login?

The assignment assumes users already have accounts and asks for the interface. I kept one demo login to make the features easy to show. The other names are sample friends and members, not separate accounts.

### How does login work?

`login.js` listens for the sign-in form, reads the username and password, and compares them with the one demo account. When they match, it adds a signed-in marker to `sessionStorage` and opens Home. This is for demonstration, not secure authentication.

### What is `localStorage`?

It is a small storage area built into the browser. `JSON.stringify()` turns the app's data into text so it can be saved. `JSON.parse()` turns it back into a JavaScript object when the next page opens. This lets likes and messages stay after changing pages.

### What is `sessionStorage`?

It stores a short sign-in marker for the current browser session. The marker goes away when the session ends. The example posts and messages use `localStorage` so they remain in the same browser.

### How is the friend order decided?

Each sample member has a `lastLogin` value in minutes. The code sorts the friend list from the smallest number to the largest, so the person who logged in most recently appears first.

### How does a like change the count?

Every post has `likes`, `dislikes`, and `myReaction`. The first click adds one to the selected count. Clicking the same button again removes that reaction. Choosing the other reaction moves the one count from likes to dislikes or the other way around.

### How does the ignored friend request rule work?

Each person has an `ignoresMe` value. Noor's sample value is `true`. Before a request can be added, the code checks this value. That is why the page shows Noor as unavailable.

### How can you message someone who is not a friend?

Messages lists all the sample people, not only friends. Selecting a person opens a local conversation. A note appears in that contact's conversation for the signed-in demo member. It is not delivered to another account.

### What does the profile page do?

Without an ID in the page link it shows the signed-in member's details and full friends list. Clicking a friend's name opens that person's sample profile. The profile's Message button opens the conversation using the same person ID, so it shows earlier notes for that contact.

### How do you share with selected friends?

The audience menu has one All friends checkbox and one checkbox per friend. You can tick more than one name. The chosen names are saved with the post and shown beneath it. This one-account demo shows the selected audience without sending a network request.

### What error checks are included?

Sign-in fields are required, incorrect details show a message, and empty posts cannot be shared. Message and post text are trimmed and limited in length. Text is escaped before it is added to the page.

### What is one limitation?

The data belongs to this browser only. It is not shared with another person's browser, and the demo password is visible in the source code. A real site would need a server to handle accounts and protect private information.

## JavaScript words to remember

- `addEventListener()` runs code after a click or form submission.
- `find()` locates one matching item in an array.
- `filter()` makes a smaller array from matching items.
- `sort()` changes the order of an array.
- `map()` builds page content from an array.
- `escapeText()` keeps typed text from being interpreted as page markup.

