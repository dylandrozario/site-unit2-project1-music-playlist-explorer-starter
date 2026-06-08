## Music Playlist Explorer — Planning Spec

### Data Shape
[Leave blank — fill in before Milestone 3]

### UI and Interaction Rules

**Visual system (Option A — "Spotify Dark")**

- Background `#121212`, card surface `#181818`, hover surface `#282828`.
- Text `#ffffff`, muted text `#b3b3b3`. Accent `#1DB954` (Spotify green).
- Card radius `12px`, grid gap `24px`, modal shadow `0 8px 24px rgba(0,0,0,0.5)`.

**Layout**

- Sticky slim header: wordmark (left), nav links `All Playlists` · `Featured` and a search bar (right). The active nav link shows an accent-colored underline.
- Playlist grid uses `grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))` with a `24px` gap so at least 6 tiles fit on a laptop at full screen and reflow responsively without media queries.

**Interaction rules**

1. **Render on load** — On page load, `renderPlaylists()` reads the playlist data array and builds one tile per playlist into the grid. Each tile shows the cover image, playlist name (bold), author (muted), and a footer row with a heart icon and like count.
2. **Open details modal** — Clicking a tile anywhere *except the heart* opens a centered modal populated with the playlist's cover, name, author, and song list (title · artist · duration). The backdrop darkens to `rgba(0,0,0,0.6)` with a blur and page scroll is locked. The modal closes on backdrop click, the ✕ button, or the `Esc` key.
3. **Like toggle** — Clicking the heart toggles only that playlist's liked state and calls `event.stopPropagation()` so the modal does not open. Unliked → liked: like count `+1` and the heart fills with the accent color. Liked → unliked: like count `-1` and the heart returns to its outline state. Liked state is held on the playlist object in memory.
4. **Shuffle songs** — A shuffle button in the detail modal reorders that playlist's song array (Fisher–Yates) and re-renders the song list so the order visibly differs from the previous render.
5. **Navigation** — Header links switch between the All Playlists view and the Featured page without using the browser's back/forward buttons.
6. **Featured randomization** — On Featured page load, a random index is chosen from the playlists array and that playlist's image, name, and full song list are rendered. Reloading the page selects a new playlist (the same one may appear twice in a row).

### Function Specs
[Add function specs here as you plan each milestone]

### AI Feature Spec (Milestone 8)
[Leave blank — fill in before Milestone 8]

### Decisions Log

**Milestone 0 — Design direction**

- Chose the "Spotify Dark" layout (Option A) over glassmorphism and editorial-light options because it best fits a music explorer and keeps text legible on dark cards (a grading criterion).
- Accent color: Spotify green `#1DB954`.
- Grid uses `repeat(auto-fill, minmax(220px, 1fr))` instead of a fixed column count so the "≥6 tiles visible on a laptop" requirement is met responsively without media queries.
- Like state and shuffle order are kept on in-memory playlist objects for now; persistence (localStorage) deferred to a later milestone if needed.
