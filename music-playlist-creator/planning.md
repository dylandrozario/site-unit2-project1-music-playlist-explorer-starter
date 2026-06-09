## Music Playlist Explorer — Planning Spec

### Data Schema

**Playlist Object:**
- `id` (string) — Unique identifier for the playlist to track and reference individual playlists
- `playlistName` (string) — The name of the playlist displayed on the tile and in the modal
- `playlistAuthor` (string) — The creator/author of the playlist displayed on the tile and in the modal
- `playlistCoverUrl` (string) — URL or path to the cover image displayed on the tile and in the modal
- `likeCount` (number) — The number of likes for the playlist, displayed next to the heart icon
- `isLiked` (boolean) — Tracks whether the current user has liked this playlist (affects heart icon color)
- `songs` (array of Song objects) — Collection of songs that belong to this playlist

**Song Object:**
- `title` (string) — The name of the song displayed in the modal's song list
- `artist` (string) — The artist who performed the song, displayed below the title in the modal
- `album` (string) — The album name the song belongs to, displayed below the artist in the modal
- `duration` (string) — The length of the song in mm:ss format, displayed on the right side of each song item
- `cover` (string) — URL or path to the song's cover image (60x60px thumbnail) displayed in the modal

### Data Shape

```js
const playlists = [
  {
    id:              // Unique identifier for the playlist
    playlistName:     // Bold title shown on card and modal
    playlistAuthor:    // Muted text shown below title
    playlistCoverUrl:  // Cover image for card and modal
    likeCount:                       // Number displayed next to heart icon
    isLiked:                       // Boolean for liked state (fills heart when true)
    songs: [
      {
        title:            // Song title in modal song list
        artist:             // Artist name in modal song list
        duration:                  // Duration in modal song list (mm:ss format)
      },
      // ... more songs
    ]
  },
  // ... more playlists
];
```

**Element and class naming conventions:**

- **Playlist card**: `.playlist-card` container
  - `.playlist-card-cover` — cover image
  - `.playlist-card-name` — playlist name (bold)
  - `.playlist-card-author` — author (muted)
  - `.playlist-card-footer` — footer row containing heart and like count
  - `.playlist-card-heart` — heart icon (add `.playlist-card__heart--liked` when isLiked is true)
  - `.playlist-card-like-count` — like count number

- **Modal**: `.modal` container (hidden by default, add `.modal--open` to show)
  - `.modal-backdrop` — darkened backdrop with blur
  - `.modal-content` — centered content box
  - `.modal-close` — ✕ close button
  - `.modal-cover` — large cover image
  - `.modal-name` — playlist name
  - `.modal-author` — author name
  - `.modal-song-list` — container for songs
  - `.modal-song-item` — individual song row
  - `.modal-shuffle-btn` — shuffle button

- **Header**: `.header` (sticky)
  - `.header-wordmark` — wordmark/logo
  - `.header-nav` — navigation links container
  - `.header-nav-link` — individual nav links (add `.header__nav-link--active` for active state)
  - `.header-search` — search bar

### UI and Interaction Rules

**Visual system**

- Background `#000000` (pure black), main content area `#0a0a0a` (very dark gray), card surface `#1a1a1a`, hover surface `#242424`.
- Text `#ffffff`, muted text `#b3b3b3`, tertiary text `#888888` (for album names). 
- Header/Footer `#17a34a` (darker green), header text `#e0e0e0` (light grey).
- Modal background `#1a1a1a`, song items `#2a2a2a`, song items hover `#333333`.
- Card radius `12px`, grid gap `24px`, modal shadow `0 8px 24px rgba(0,0,0,0.5)`.
- Main content area has `border-radius: 12px` for visual separation.
- Header/Footer shadows `0 2px 8px rgba(0,0,0,0.4)`.
- Like heart color: `#e74c3c` (red) for hover and liked state.
- Song list gap: `8px` vertical spacing between items for better visibility.

**Layout**

- Sticky header with green background: wordmark (left), nav links `All Playlists` · `Featured` and a search bar (right). The active nav link shows a white underline. Header has drop shadow for depth.
- Playlist grid displays exactly 4 cards per row using `grid-template-columns: repeat(4, 1fr)`.

**Interaction rules**

1. **Render on load** — On page load, `renderPlaylists()` reads the playlist data array and builds one tile per playlist into the grid. Each tile shows the cover image, playlist name (bold), author (muted), and a footer row with a heart icon and like count.
2. **Open details modal** — Clicking a tile anywhere *except the heart* opens a centered modal populated with the playlist's cover, name, author, and song list (title · artist · duration). The backdrop darkens to `rgba(0,0,0,0.6)` with a blur and page scroll is locked. The modal closes on backdrop click, the ✕ button, or the `Esc` key.
3. **Like toggle** — Clicking the heart toggles only that playlist's liked state and make sure the modal does not open. Unliked → liked: like count `+1` and the heart fills with red (`#e74c3c`). Liked → unliked: like count `-1` and the heart returns to its outline state (muted gray). Liked state is held on the playlist object in memory.
4. **Shuffle songs** — A shuffle button in the detail modal reorders that playlist's song array and re-renders the song list so the order visibly differs from the previous render.
5. **Navigation** — Header links switch between the All Playlists view and the Featured page without using the browser's back/forward buttons.

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

**Milestone 1 — HTML structure**

- Built semantic HTML with `<header>`, `<main>`, and `<footer>` elements for proper document structure.
- Created 8 hard-coded playlist cards with all required fields: cover image, title, author, heart icon, and like count.
- Used single-hyphen class naming convention (`.playlist-card-name`) instead of BEM double-underscore for simplicity.
- Modal structure uses `.modal-overlay` as outer container with `.modal-content` inside for proper backdrop/content separation.
- Added song list structure with small cover images (60x60px), stacked text (title/artist/album), and right-aligned duration.
- Validated HTML structure matches planning.md spec and wireframes before accepting AI-generated code.

**Milestone 2 — CSS styling**

- Changed header/footer from dark gray to darker green (`#17a34a`) with shadows for visual prominence and brand consistency.
- Changed main background to very dark gray (`#0a0a0a`) with border-radius for visual separation from pure black body.
- Updated grid from responsive `auto-fill` to fixed 4 columns per row (`repeat(4, 1fr)`) for consistent layout.
- Made like heart red (`#e74c3c`) instead of green for better visual feedback and universal "like" convention.
- Added hover effects: cards lift up (`translateY(-4px)`), hearts scale (`scale(1.1)`), subtle color transitions throughout.
- Modal song items given lighter background (`#2a2a2a`) with 8px vertical gaps for better visibility and separation.
- Moved nav links to right side of header using `margin-left: auto` for better visual balance.
- Reviewed all AI-generated CSS against visual intent and planning.md spec before accepting.
