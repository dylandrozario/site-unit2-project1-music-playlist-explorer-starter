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
        album: //album that song comes from
        cover: //Song image
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
3. **Like toggle** — Clicking the heart toggles only that playlist's liked state and make sure the modal does not open. Unliked → liked: like count `+1` and the heart fills with the accent color. Liked → unliked: like count `-1` and the heart returns to its outline state. Liked state is held on the playlist object in memory.
4. **Shuffle songs** — A shuffle button in the detail modal reorders that playlist's song array and re-renders the song list so the order visibly differs from the previous render.
5. **Navigation** — Header links switch between the All Playlists view and the Featured page without using the browser's back/forward buttons.

### Function Specs
- renderPlaylist() - to display all playlist cards
    -calls cardCreation() 
- cardCreation() - display single playlist card
    -function takes in JSON object of a playlist
    -it should return creating an card on the screen with all the information in the JSON expected such as playlistName, playlistAuthor, playlistCover, likeCount, isLiked and style it according to planning.md and current hard-coded example
    -The DOM element it appends to is .playlistcards div and creates a article with class .playlist-card.
    -The field that are used from the object are 
    playlistName:     // Bold title shown on card and modal
    playlistAuthor:    // Muted text shown below title
    playlistCoverUrl:  // Cover image for card and modal
    likeCount:                       // Number displayed next to heart icon
    isLiked:                       // Boolean for liked state (fills heart when true)
- Functions for opening/closing the modal
  
  **Opening the modal:**
  - Add click event listener to each `.playlist-card` when it's created in `cardCreation()`
  - When a card is clicked, pass that playlist's data to `openModal(playlist)` function
  - `openModal(playlist)` does:
    1. Get modal overlay element (`#modalOverlay`)
    2. Add `.modal-open` class to show it
    3. Update modal cover: set `.modal-cover` src to `playlist.playlistCoverUrl`
    4. Update modal name: set `.modal-name` textContent to `playlist.playlistName`
    5. Update modal author: set `.modal-author` textContent to `playlist.playlistAuthor`
    6. Clear existing song list: set `.modal-song-list` innerHTML to empty string
    7. Loop through `playlist.songs` array and for each song:
       - Create `<li class="modal-song-item">`
       - Add song cover image `.modal-song-cover` with `song.cover`
       - Add song title `.modal-song-title` with `song.title`
       - Add song artist `.modal-song-artist` with `song.artist`
       - Add song album `.modal-song-album` with `song.album`
       - Add song duration `.modal-song-duration` with `song.duration`
       - Append to `.modal-song-list`
    8. Lock page scroll: `document.body.style.overflow = 'hidden'`
  
  **Closing the modal:**
  - `closeModal()` function does:
    1. Get modal overlay element
    2. Remove `.modal-open` class to hide it
    3. Unlock page scroll: `document.body.style.overflow = ''`
  - Call `closeModal()` when:
    - ✕ button (`.modal-close`) is clicked
    - Backdrop (`.modal-overlay`) is clicked (but NOT `.modal-content`)
    - Esc key is pressed (`keydown` event, check if `event.key === 'Escape'`)

- Like toggle function (`toggleLike(playlist, heartButton, likeCountSpan)`)
  
  **When a PREVIOUSLY UNLIKED playlist is liked:**
  - Data model changes:
    - Set `playlist.isLiked = true`
    - Increment `playlist.likeCount` by 1
  - DOM changes:
    - Add `.playlist-card-heart--liked` class to heart button
    - Update like count span text content to new count
    - Heart fills with red color (#e74c3c) via CSS class
  
  **When a PREVIOUSLY LIKED playlist is unliked:**
  - Data model changes:
    - Set `playlist.isLiked = false`
    - Decrement `playlist.likeCount` by 1
  - DOM changes:
    - Remove `.playlist-card-heart--liked` class from heart button
    - Update like count span text content to new count
    - Heart returns to outline state (muted gray) via CSS
  
  **Constraint ensuring one like at a time:**
  - The `playlist.isLiked` boolean acts as a toggle flag
  - Function checks current state: if `isLiked === true`, it unlikes; if `false`, it likes
  - Cannot like twice because `isLiked` is already `true` on second click, triggering unlike instead
  
  **Event handling:**
  - Add click listener to `.playlist-card-heart` button in `cardCreation()`
  - Use `event.stopPropagation()` to prevent modal from opening when heart is clicked
  - Pass playlist object and DOM elements to toggle function

- Shuffle function (`shuffleSongs(playlist)`)
  
  **Purpose:**
  - Randomly reorder the songs in the currently open playlist modal
  - Provides a way for users to see songs in a different order without manually sorting
  
  **Data model changes:**
  - Does NOT mutate the original `playlist.songs` array
  - Creates a copy of the songs array using spread operator `[...playlist.songs]`
  - Shuffles the copy using Fisher-Yates algorithm
  - Original order is preserved in the playlist object
  
  **DOM changes:**
  - Clear existing song list: set `.modal-song-list` innerHTML to empty string
  - Loop through the shuffled copy array and for each song:
    - Create `<li class="modal-song-item">`
    - Add song cover image `.modal-song-cover` with `song.cover`
    - Add song title `.modal-song-title` with `song.title`
    - Add song artist `.modal-song-artist` with `song.artist`
    - Add song album `.modal-song-album` with `song.album`
    - Add song duration `.modal-song-duration` with `song.duration`
    - Append to `.modal-song-list`
  
  **Shuffle algorithm (Fisher-Yates):**
  1. Create a copy of `playlist.songs` array
  2. Start from the last element in the copy
  3. Generate a random index from 0 to current position using `Math.floor(Math.random() * (i + 1))`
  4. Swap the current element with the randomly selected element using array destructuring
  5. Move to the previous element and repeat
  6. Continue until reaching the first element
  
  **Event handling:**
  - Add click listener to `.modal-shuffle-btn` button in `openModal()` function
  - When clicked, call `shuffleSongs(playlist)` with the current playlist object
  - Button is only active when modal is open
  
  **Multi-shuffle behavior:**
  - Each click produces a NEW random order (not toggling between two states)
  - Multiple clicks will continue to produce different random arrangements
  - No limit on number of shuffles
  
  **Original order preservation:**
  - Closing and reopening the modal displays songs in their original order
  - Original order is read from the unchanged `playlist.songs` array when `openModal()` runs
  - Shuffle state is NOT persisted - it only affects the current modal view
  - Page refresh reloads original order from data.json

- Navigation functions

### Featured Page Specification

**Overview:**
The Featured page is a separate HTML page (`featured.html`) that randomly selects and displays one playlist from the data. This page provides a detailed, focused view of a single playlist without requiring modal interaction.

**Layout Structure (based on reference wireframe):**

The page uses a horizontal split layout with two main sections:

**Left Section (Playlist Info):**
- Large square playlist cover image (approximately 200x200px)
- Playlist name displayed below cover (large, bold, white text)
- Playlist author/creator name (muted gray text)
- Like button (heart icon) with like count
- Positioned on the left side of the content area with vertical stacking

**Right Section (Song List - "Tracklist"):**
- Full-height song list table/list
- Header: "Tracklist" text in white
- Each song row displays:
  - Track number (left-aligned, muted gray)
  - Song title (bold white text)
  - Artist name (muted gray text below title)
  - Album name (muted gray text)
  - Duration (right-aligned, muted gray, mm:ss format)
- Songs displayed in a clean table-like format with consistent spacing
- Rows have subtle hover effect (background darkens slightly)

**Visual Design (using existing color scheme):**

Colors:
- Background: `#000000` (pure black)
- Main content area: `#0a0a0a` (very dark gray) with `border-radius: 12px`
- Song list container: `#1a1a1a` (card surface color)
- Song row hover: `#242424` (hover surface)
- Primary text: `#ffffff` (white)
- Secondary text (artist, album, duration): `#b3b3b3` (muted text)
- Tertiary text (track numbers): `#888888` (tertiary text)
- Header/Footer: `#17a34a` (darker green) matching main site
- Like heart: `#e74c3c` (red) for liked state

Layout:
- Same header and footer as main site (sticky header with green background)
- Content area uses flexbox or grid for horizontal split (60/40 or 50/50)
- Left section: fixed width or flex-basis with playlist info vertically centered
- Right section: flex-grow for song list, scrollable if needed
- Consistent padding and spacing: 24-32px margins
- Border radius: 12px on containers
- Gap between sections: 32-48px

Typography:
- Playlist name: 28-32px, bold, `#ffffff`
- Playlist author: 16-18px, regular, `#b3b3b3`
- "Tracklist" header: 20-24px, bold, `#ffffff`
- Song title: 14-16px, bold, `#ffffff`
- Song artist/album: 13-14px, regular, `#b3b3b3`
- Track number: 14px, regular, `#888888`
- Duration: 14px, regular, `#b3b3b3`

**Element naming conventions:**

*Unique to Featured page (new classes):*
- `.featured-page` — main container for featured page content
- `.featured-layout` — flexbox/grid container for left-right split
- `.featured-left` — left section container
- `.featured-cover` — large cover image
- `.featured-name` — playlist name
- `.featured-author` — playlist author
- `.featured-like-section` — container for heart and count
- `.featured-heart` — heart button (uses same styling as `.playlist-card-heart`)
- `.featured-heart--liked` — liked state (uses same styling as `.playlist-card-heart--liked`)
- `.featured-like-count` — like count number
- `.featured-right` — right section container
- `.featured-tracklist-header` — "Tracklist" heading
- `.featured-tracklist` — song list container (ul/ol)
- `.featured-track-number` — track number column (new element not in modal)

*Reused from existing modal styles (for consistency):*
- `.modal-song-item` — individual song row styling (reuse for featured tracks)
- `.modal-song-cover` — song cover image (60x60px)
- `.modal-song-info` — container for title/artist/album stack
- `.modal-song-title` — song title
- `.modal-song-artist` — artist name
- `.modal-song-album` — album name
- `.modal-song-duration` — duration time

**Why reuse modal classes?**
- Songs display the same information in both contexts
- Consistent visual appearance across site
- Write CSS once, use everywhere
- Easier maintenance (one place to update styling)

**Random selection function (`selectRandomPlaylist(playlists)`):**
- **Purpose**: Select one random playlist from the playlists array to display
- **Parameters**: `playlists` array from data.json
- **Returns**: Single playlist object
- **Algorithm**:
  1. Generate random index: `Math.floor(Math.random() * playlists.length)`
  2. Return `playlists[randomIndex]`
- **Called**: Once when Featured page loads

**Render featured playlist function (`renderFeaturedPage(playlist)`):**
- **Purpose**: Populate the Featured page with the selected playlist data
- **Parameters**: Single playlist object
- **DOM operations**:
  1. Update cover image: set `.featured-cover` src to `playlist.playlistCoverUrl`
  2. Update playlist name: set `.featured-name` textContent to `playlist.playlistName`
  3. Update author: set `.featured-author` textContent to `playlist.playlistAuthor`
  4. Update like count: set `.featured-like-count` textContent to `playlist.likeCount`
  5. Set liked state: add/remove `.featured-heart--liked` class based on `playlist.isLiked`
  6. Clear existing tracklist: set `.featured-tracklist` innerHTML to empty
  7. Loop through `playlist.songs` array with index:
     - Create `<li class="modal-song-item">` (reuse modal song styling)
     - Add track number element: `<span class="featured-track-number">${index + 1}</span>`
     - Add song cover: `<img class="modal-song-cover" src="${song.cover}">`
     - Create song info container: `<div class="modal-song-info">`
       - Add title: `<p class="modal-song-title">${song.title}</p>`
       - Add artist: `<p class="modal-song-artist">${song.artist}</p>`
       - Add album: `<p class="modal-song-album">${song.album}</p>`
     - Add duration: `<span class="modal-song-duration">${song.duration}</span>`
     - Append to `.featured-tracklist`
  8. Add event listener to heart button for like toggle

**Navigation:**
- Use existing header with nav links
- "All Playlists" link navigates to `index.html`
- "Featured" link navigates to `featured.html`
- Active state shows on "Featured" link (`.header-nav-link--active`)

**Page load behavior:**
- On page load (`featured.html`), `loadFeaturedPlaylist()` function:
  1. Fetch data from `./data/data.json`
  2. Call `selectRandomPlaylist(data.playlists)`
  3. Call `renderFeaturedPage(playlist)` with selected playlist
- Each page load/refresh selects a NEW random playlist

- Navigation functions


### AI Feature Spec (Milestone 8)
Role: What role should the model play?
  -Model should be a revisionist and writer that is world class that makes a fun and short description of a playlist.
Task: What is the model being asked to do? (generating a description for a music playlist based on its name, author, and song list)
  -Model should generate a short description of a playlist based on the modal it is on. The model should use the playlist name, the songs in the playlist (including the songs title, album, and artit) to base their description off of. The description should be fun and not too formal.
Inputs: What playlist data will you pass to the model?
  -The inputs should be the object of playlist that is the current modal. It should be using the 
Output format: What should the response look like? (e.g., 2–3 sentence description that captures the vibe and theme of the playlist)
Constraints: What should the model avoid? (e.g., don't list the songs individually, don't use generic marketing language)
Failure behavior: What should the UI show if the API call fails or the model doesn't respond?


### Decisions Log

**Milestone 0 — Design direction**

- Chose the "Spotify Dark" layout.
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

**Milestone 3 — Data Schema and Dynamic Rendering**

- Created complete Data Schema in `planning.md` (lines 3-45) defining:
  - **Playlist Object** fields: `id`, `playlistName`, `playlistAuthor`, `playlistCoverUrl`, `likeCount`, `isLiked`, `songs` array
  - **Song Object** fields: `title`, `artist`, `album`, `duration`, `cover`
  - Data shape with code example showing structure
- Created `data/data.json` with 8 playlists organized by mood/genre:
  - Happy Vibes, Sad & Emotional, Workout Motivation, Chill & Relax
  - Rock Classics, Hip-Hop Essentials, Pop Hits, EDM Bangers
  - Each playlist has 4 real songs with complete metadata
  - All data matches schema exactly
- Wrote function specs before implementation:
  - `renderPlaylist(playlists)` - loops through playlists array and calls cardCreation for each
  - `cardCreation(playlist)` - takes playlist object, creates `<article class="playlist-card">`, populates with data, attaches event listeners, returns the element
  - Spec documented fields used: `playlistName`, `playlistAuthor`, `playlistCoverUrl`, `likeCount`, `isLiked`
- Implemented dynamic card rendering:
  - `loadPlaylists()` async function fetches data from `./data/data.json`
  - `renderPlaylist()` clears container and loops through playlists calling `cardCreation()`
  - `cardCreation()` creates card with:
    - Cover image (`playlist.playlistCoverUrl`)
    - Playlist name in bold (`playlist.playlistName`)
    - Author in muted text (`playlist.playlistAuthor`)
    - Heart button and like count (`playlist.likeCount`)
  - Cards appended to `#playlistCards` container
- Validated implementation against spec:
  ✓ Data Schema documented in planning.md with all required fields
  ✓ data.json matches schema structure exactly (8 playlists, each with 4 songs)
  ✓ Application loads and parses JSON data on page load
  ✓ Playlist cards dynamically created from data (not hard-coded)
  ✓ Each card displays: cover image, name, author, like count
  ✓ Cards arranged in 4-column grid layout
  ✓ Function specs written before implementation
  ✓ Implementation matches spec exactly

**Milestone 4 — Modal functionality**

- Wrote complete function spec before implementation covering:
  - `openModal(playlist)` function with 8 steps: get element, add class, update cover/name/author, clear songs, loop and create song items, lock scroll
  - `closeModal()` function with 3 steps: get element, remove class, unlock scroll
  - Three ways to close: ✕ button click, backdrop click (not content), Esc key press
  - Song list population with all fields: cover (60x60px), title, artist, album, duration
- Modal HTML structure in `index.html`:
  - `.modal-overlay` outer container with `.modal-open` class for showing
  - `.modal-content` inner container with playlist details
  - `.modal-close` button, `.modal-cover` image, `.modal-name` and `.modal-author` text
  - `.modal-song-list` with `.modal-song-item` elements
- Modal CSS styling:
  - Overlay: `position: fixed`, covers full viewport, `background-color: rgba(0,0,0,0.6)` with `backdrop-filter: blur(4px)`
  - Hidden by default with `display: none`, shown with `.modal-open` class setting `display: flex`
  - Content: centered using flexbox, `background-color: #1a1a1a`, `border-radius: 12px`, `max-width: 600px`
  - Song items: `background-color: #2a2a2a` with 8px gaps, hover effect to `#333333`
- Event handling:
  - Card click listener in `cardCreation()` calls `openModal(playlist)` (lines 170-172)
  - Close button click listener (line 67)
  - Backdrop click listener checks `event.target === modalOverlay` to avoid closing on content click (lines 70-74)
  - Esc key listener checks `event.key === 'Escape'` (lines 77-80)
- Validated implementation against spec:
  ✓ Clicking playlist card opens modal with all playlist details
  ✓ Modal displays: cover image, playlist name, author, complete song list
  ✓ Each song shows: cover (60x60px), title, artist, album, duration
  ✓ Modal closes on ✕ button click
  ✓ Modal closes on backdrop click (not on content click)
  ✓ Modal closes on Esc key press
  ✓ Page scroll locks when modal open, unlocks when closed
  ✓ Modal properly prevents card click when clicking heart (via stopPropagation)

**Milestone 5 — Like toggle functionality**

- Wrote complete function spec before implementation covering both branches:
  - Previously unliked → liked: increment count, add CSS class, fill heart red
  - Previously liked → unliked: decrement count, remove CSS class, outline state
  - Constraint logic using `playlist.isLiked` boolean flag
  - Event handling with `event.stopPropagation()` to prevent modal opening
- Implemented `toggleLike(playlist, heartButton, likeCountSpan)` function that:
  - Checks current `playlist.isLiked` state
  - Updates data model: toggles `isLiked` boolean and increments/decrements `likeCount`
  - Updates DOM: adds/removes `.playlist-card-heart--liked` class and updates count display
- Added CSS styling for liked state: red fill color (`#e74c3c`) with matching stroke
- Heart button uses Unicode ♥ character with CSS for outline (transparent + stroke) and filled (red) states
- Event listener attached in `cardCreation()` with `event.stopPropagation()` to prevent modal
- Validated implementation against spec:
  ✓ Each playlist card has clickable heart icon (`.playlist-card-heart`)
  ✓ Clicking heart increments count and fills heart red
  ✓ Clicking again decrements count and returns to outline
  ✓ Like count updates immediately on card (`.playlist-card-like-count`)
  ✓ Modal does not open when clicking heart
  ✓ State persists in memory during session (in `playlist.isLiked` and `playlist.likeCount`)

**Milestone 6 — Shuffle functionality**

- Wrote complete function spec before implementation covering:
  - Fisher-Yates shuffle algorithm
  - Original order preservation (creates copy, doesn't mutate original array)
  - Multi-shuffle behavior (each click produces new random order)
  - Event handling (attached in openModal function)
- Implemented `shuffleSongs(playlist)` function that:
  - Creates copy using spread operator `[...playlist.songs]`
  - Shuffles copy with Fisher-Yates algorithm (backward iteration with random swaps)
  - Re-renders modal song list with shuffled order
  - Preserves original `playlist.songs` array unchanged
- Added shuffle button event listener in `openModal()` function
- Validated implementation against spec:
  ✓ Shuffle button exists in modal (`.modal-shuffle-btn`)
  ✓ Button clickable and calls `shuffleSongs(playlist)`
  ✓ Each click produces different random order
  ✓ Original order restored when closing/reopening modal
  ✓ No mutation of source data - `playlist.songs` remains unchanged

**Milestone 7 — Featured Page**

- Wrote complete Featured Page specification in `planning.md` (lines 225-361) covering:
  - Layout structure: horizontal split with left (playlist info) and right (tracklist) sections
  - Visual design with existing color scheme (green header, dark theme, red hearts)
  - Element naming conventions with class reuse strategy (reuse `.modal-song-item` classes)
  - `selectRandomPlaylist(playlists)` function spec with random index generation
  - `renderFeaturedPage(playlist)` function spec with 8 DOM operation steps
  - Navigation between `index.html` and `featured.html` with proper active states
  - Page load behavior: fetch data → select random → render
- Created `featured.html` as separate HTML page:
  - Same header/footer structure as main site
  - Active state on "Featured" nav link (`.header-nav-link--active`)
  - Layout structure: `.featured-layout` with `.featured-left` and `.featured-right`
  - Placeholder content populated by JavaScript on load
- Implemented `featured.js` with all specified functions:
  - `selectRandomPlaylist(playlists)` - generates random index, returns playlist
  - `renderFeaturedPage(playlist)` - populates all elements, creates song list with track numbers
  - `toggleLike(playlist, heartButton, likeCountSpan)` - same toggle logic as main page
  - `loadFeaturedPlaylist()` - async fetch, select random, render, with error handling
- Added CSS styling for Featured page:
  - `.featured-layout` - flexbox horizontal split with 48px gap
  - `.featured-left` - fixed 300px width, vertical stack
  - `.featured-cover` - 300x300px square with shadow
  - `.featured-heart` - 32px with same stroke styling as card hearts
  - `.featured-right` - flex-grow container with `#1a1a1a` background
  - `.featured-tracklist-header` - 24px bold "Tracklist" heading
  - `.featured-track-number` - track number column (new element, tertiary gray)
  - **Reuses** `.modal-song-item`, `.modal-song-cover`, `.modal-song-info`, `.modal-song-title`, `.modal-song-artist`, `.modal-song-album`, `.modal-song-duration` for consistency
- Updated navigation links in both pages:
  - `index.html`: links to `index.html` and `featured.html`, active on "All Playlists"
  - `featured.html`: links to `index.html` and `featured.html`, active on "Featured"
- Fixed footer positioning issue:
  - Added flexbox to `body` with `min-height: 100vh` and `flex-direction: column`
  - Main content has `flex: 1` to grow and fill space
  - Footer has `margin-top: auto` to stick to bottom
- Validated implementation against spec:
  ✓ Planning.md includes complete Featured Page section with layout, functions, and navigation specs
  ✓ Featured page displays random playlist on each load/refresh
  ✓ Page shows: cover image, playlist name, author, like button with count, complete song list
  ✓ Song list displays: track numbers (1-4), title, artist, album, duration
  ✓ Layout matches wireframe: horizontal split, left section with playlist info, right section with tracklist
  ✓ Uses existing color scheme: green header/footer, dark backgrounds, red hearts, muted text
  ✓ Navigation works: "All Playlists" → `index.html`, "Featured" → `featured.html`
  ✓ Active states correct on both pages
  ✓ Class reuse strategy implemented (modal song classes reused for consistency)
  ✓ Like functionality works on Featured page
  ✓ Footer stays at bottom of viewport on both short and long pages
  ✓ Each page load selects NEW random playlist (no caching)
