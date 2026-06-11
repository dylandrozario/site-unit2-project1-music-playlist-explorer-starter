const closeBtn = document.querySelector(".modal-close");
const modalOverlay = document.querySelector("#modalOverlay");

// Open modal function
function openModal(playlist) {
    // 1. Get modal overlay element
    const modal = document.querySelector("#modalOverlay");

    // 2. Add .modal-open class to show it
    modal.classList.add("modal-open");

    // 3. Update modal cover
    const modalCover = document.querySelector(".modal-cover");
    modalCover.src = playlist.playlistCoverUrl;
    modalCover.alt = `${playlist.playlistName} cover`;

    // 4. Update modal name
    const modalName = document.querySelector(".modal-name");
    modalName.textContent = playlist.playlistName;

    // 5. Update modal author
    const modalAuthor = document.querySelector(".modal-author");
    modalAuthor.textContent = playlist.playlistAuthor;

    // 6. Clear existing song list
    const songList = document.querySelector(".modal-song-list");
    songList.innerHTML = '';

    // 7. Loop through songs array and create song items
    playlist.songs.forEach(song => {
        const songItem = document.createElement('li');
        songItem.className = 'modal-song-item';

        songItem.innerHTML = `
            <img src="${song.cover}" alt="${song.title} cover" class="modal-song-cover">
            <div class="modal-song-info">
                <p class="modal-song-title">${song.title}</p>
                <p class="modal-song-artist">${song.artist}</p>
                <p class="modal-song-album">${song.album}</p>
            </div>
            <span class="modal-song-duration">${song.duration}</span>
        `;

        songList.appendChild(songItem);
    });

    // 8. Lock page scroll
    document.body.style.overflow = 'hidden';

    // 9. Add event listener to shuffle button
    const shuffleBtn = document.querySelector('.modal-shuffle-btn');
    shuffleBtn.onclick = () => shuffleSongs(playlist);

    // 10. Set up AI description button
    const aiDescriptionBtn = document.querySelector('.modal-ai-description-btn');
    const aiDescriptionText = document.querySelector('.modal-ai-description-text');

    // Reset description state
    aiDescriptionText.textContent = '';
    aiDescriptionText.style.display = 'none';

    // Check if already has description
    if (playlist.aiDescription) {
        aiDescriptionBtn.textContent = 'Regenerate Description';
        aiDescriptionText.style.display = 'block';
        aiDescriptionText.textContent = playlist.aiDescription;
    } else {
        aiDescriptionBtn.textContent = 'Generate AI Description';
    }

    aiDescriptionBtn.disabled = false;

    aiDescriptionBtn.onclick = async () => {
        const isRegenerating = aiDescriptionBtn.textContent === 'Regenerate Description';

        aiDescriptionBtn.disabled = true;
        aiDescriptionBtn.textContent = 'Loading...';
        aiDescriptionText.style.display = 'block';
        aiDescriptionText.textContent = 'Generating description...';

        // If regenerating, clear cache and force new generation
        const description = await getPlaylistDescription(playlist, isRegenerating);
        aiDescriptionText.textContent = description;
        aiDescriptionBtn.textContent = 'Regenerate Description';
        aiDescriptionBtn.disabled = false;
    };
}

// Close modal function
function closeModal() {
    // 1. Get modal overlay element
    const modal = document.querySelector("#modalOverlay");

    // 2. Remove .modal-open class to hide it
    modal.classList.remove("modal-open");

    // 3. Unlock page scroll
    document.body.style.overflow = '';
}

// Event listeners for closing the modal
closeBtn.addEventListener("click", closeModal);

// Close on backdrop click (but not on modal content)
modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});

// Close on Esc key press
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});

// Like toggle function
function toggleLike(playlist, heartButton, likeCountSpan) {
    // Check current liked state
    if (playlist.isLiked) {
        // PREVIOUSLY LIKED → UNLIKE
        // Data model changes
        playlist.isLiked = false;
        playlist.likeCount--;

        // DOM changes
        heartButton.classList.remove('playlist-card-heart--liked');
        likeCountSpan.textContent = playlist.likeCount;
    } else {
        // PREVIOUSLY UNLIKED → LIKE
        // Data model changes
        playlist.isLiked = true;
        playlist.likeCount++;

        // DOM changes
        heartButton.classList.add('playlist-card-heart--liked');
        likeCountSpan.textContent = playlist.likeCount;
    }
}

// Shuffle songs function using Fisher-Yates algorithm
function shuffleSongs(playlist) {
    // Create a COPY of the songs array (don't mutate the original)
    const shuffledSongs = [...playlist.songs];

    // Shuffle the copy using Fisher-Yates algorithm
    for (let i = shuffledSongs.length - 1; i > 0; i--) {
        // Generate random index from 0 to i
        const randomIndex = Math.floor(Math.random() * (i + 1));

        // Swap current element with randomly selected element
        [shuffledSongs[i], shuffledSongs[randomIndex]] = [shuffledSongs[randomIndex], shuffledSongs[i]];
    }

    // Re-render the song list in the modal with shuffled order
    const songList = document.querySelector('.modal-song-list');
    songList.innerHTML = ''; // Clear existing songs

    // Loop through shuffled songs and create song items
    shuffledSongs.forEach(song => {
        const songItem = document.createElement('li');
        songItem.className = 'modal-song-item';

        songItem.innerHTML = `
            <img src="${song.cover}" alt="${song.title} cover" class="modal-song-cover">
            <div class="modal-song-info">
                <p class="modal-song-title">${song.title}</p>
                <p class="modal-song-artist">${song.artist}</p>
                <p class="modal-song-album">${song.album}</p>
            </div>
            <span class="modal-song-duration">${song.duration}</span>
        `;

        songList.appendChild(songItem);
    });
}

function cardCreation(playlist) {
    console.log("In cardCreation function");
    const playlistCard = document.createElement("article");
    playlistCard.classList.add("playlist-card");
    playlistCard.innerHTML = `
        <div class="playlist-card-menu">
            <button class="playlist-card-menu-btn" aria-label="Options">⋮</button>
            <div class="playlist-card-menu-dropdown">
                <button class="playlist-card-menu-option" data-action="edit">
                    <span class="menu-icon">✎</span> Edit
                </button>
                <button class="playlist-card-menu-option" data-action="delete">
                    <span class="menu-icon">🗑</span> Delete
                </button>
            </div>
        </div>
        <img src="${playlist.playlistCoverUrl}" alt="${playlist.playlistName}" class="playlist-card-cover">
        <h3 class="playlist-card-name">${playlist.playlistName}</h3>
        <p class="playlist-card-author">${playlist.playlistAuthor}</p>
        <div class="playlist-card-footer">
            <button class="playlist-card-heart" aria-label="Like playlist">♥</button>
            <span class="playlist-card-like-count">${playlist.likeCount}</span>
        </div>
    `;

    // Get buttons and elements for event listeners
    const menuBtn = playlistCard.querySelector('.playlist-card-menu-btn');
    const menuDropdown = playlistCard.querySelector('.playlist-card-menu-dropdown');
    const editOption = playlistCard.querySelector('[data-action="edit"]');
    const deleteOption = playlistCard.querySelector('[data-action="delete"]');
    const heartButton = playlistCard.querySelector('.playlist-card-heart');
    const likeCountSpan = playlistCard.querySelector('.playlist-card-like-count');

    // Toggle menu dropdown
    menuBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent modal from opening
        menuDropdown.classList.toggle('show');
    });

    // Add click event listener to edit option
    editOption.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent modal from opening
        menuDropdown.classList.remove('show'); // Close menu
        openEditModal(playlist);
    });

    // Add click event listener to delete option
    deleteOption.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent modal from opening
        menuDropdown.classList.remove('show'); // Close menu
        deletePlaylist(playlist);
    });

    // Add click event listener to heart button for like toggle
    heartButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent modal from opening
        toggleLike(playlist, heartButton, likeCountSpan);
    });

    // Add click event listener to open modal when card is clicked
    playlistCard.addEventListener('click', () => {
        openModal(playlist);
    });

    return playlistCard;
}

function renderPlaylist(playlists) {
    console.log("In renderPlaylist function");
    const container = document.querySelector("#playlistCards");
    container.innerHTML = ''; // Clear existing cards first
    playlists.forEach(playlist => {
        const card = cardCreation(playlist);
        container.appendChild(card);
    });
}

async function loadPlaylists(){
    console.log("In loadPlaylists function");
    try{
        const response = await fetch("./data/data.json");
        const data = await response.json();

        // Store playlists globally
        allPlaylists = data.playlists;

        renderPlaylist(allPlaylists);
    } catch (error) {
        console.error("Error loading playlists:", error);
        // Optionally display an error message to the user
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Failed to load playlists. Please try again later.";
        document.body.appendChild(errorMessage);
    }
}

// AI playlist description constants
const DESCRIPTION_SYSTEM_PROMPT = `You are a music curator writing playlist descriptions.

Output format: 2-3 sentences, max 60 words, casual conversational tone.

Constraints:
- Describe the overall mood, vibe, and theme
- Mention what activities or moments this suits
- Do not list individual songs or artists
- Do not use marketing language like "perfect" or "ultimate"`;

const DESCRIPTION_FAILURE_MESSAGE = "Description unavailable — try again in a moment.";

// AI playlist description function
async function getPlaylistDescription(playlist, forceRegenerate = false) {
    // Check if description is already cached (skip if force regenerate)
    if (!forceRegenerate && playlist.aiDescription && playlist.aiDescription.length > 0) {
        return playlist.aiDescription;
    }

    // Check if API key exists
    if (typeof API_KEY === 'undefined' || !API_KEY) {
        console.error('API key not found');
        return DESCRIPTION_FAILURE_MESSAGE;
    }

    try {
        // Construct the user message with playlist info
        const songList = playlist.songs
            .map(song => `- ${song.title} by ${song.artist}`)
            .join('\n');

        const userMessage = `Playlist: "${playlist.playlistName}"
Creator: "${playlist.playlistAuthor}"
Songs:
${songList}`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Music Playlist Explorer'
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-120b:free',
                max_tokens: 80,
                temperature: 0.7,
                reasoning: {
                    exclude: true
                },
                messages: [
                    { role: 'system', content: DESCRIPTION_SYSTEM_PROMPT },
                    { role: 'user', content: userMessage }
                ]
            })
        });

        if (!response.ok) {
            // Log rate limit errors for debugging
            if (response.status === 429) {
                console.warn('Rate limit exceeded - please wait before generating more descriptions');
            }
            return DESCRIPTION_FAILURE_MESSAGE;
        }

        const data = await response.json();

        // Safely extract description with optional chaining
        const description = data?.choices?.[0]?.message?.content?.trim() || DESCRIPTION_FAILURE_MESSAGE;

        // Cache the description if it's not the failure message
        if (description !== DESCRIPTION_FAILURE_MESSAGE) {
            playlist.aiDescription = description;
        }

        return description;

    } catch (error) {
        console.error('getPlaylistDescription failed:', error);
        return DESCRIPTION_FAILURE_MESSAGE;
    }
}

// Global playlists array to store all playlists
let allPlaylists = [];
let currentSortMethod = 'dateAdded'; // Track current sort method

// Create Playlist functionality
const createModal = document.querySelector('#createPlaylistModal');
const openCreateModalBtn = document.querySelector('#openCreateModalBtn');
const closeCreateModalBtn = document.querySelector('#closeCreateModalBtn');
const cancelCreateBtn = document.querySelector('#cancelCreateBtn');
const createPlaylistForm = document.querySelector('#createPlaylistForm');
const songInputsContainer = document.querySelector('#songInputsContainer');
const addSongBtn = document.querySelector('#addSongBtn');
const removeSongBtn = document.querySelector('#removeSongBtn');

let songCount = 0;

// Add initial song input
function addSongInput() {
    if (songCount >= 10) {
        document.querySelector('#formError').textContent = 'Maximum 10 songs allowed';
        return;
    }

    songCount++;
    const songEntry = document.createElement('div');
    songEntry.className = 'song-entry';
    songEntry.innerHTML = `
        <div class="song-entry-header">Song ${songCount}</div>
        <div class="song-input-row">
            <div class="form-group">
                <label>Title *</label>
                <input type="text" class="song-title" placeholder="Song Title" required>
            </div>
            <div class="form-group">
                <label>Artist *</label>
                <input type="text" class="song-artist" placeholder="Artist Name" required>
            </div>
        </div>
        <div class="song-input-row">
            <div class="form-group">
                <label>Album</label>
                <input type="text" class="song-album" placeholder="Album Name">
            </div>
            <div class="form-group">
                <label>Duration (mm:ss) *</label>
                <input type="text" class="song-duration" placeholder="3:45" required pattern="[0-9]{1,2}:[0-5][0-9]">
            </div>
        </div>
    `;
    songInputsContainer.appendChild(songEntry);
    removeSongBtn.disabled = false;
    document.querySelector('#formError').textContent = '';
}

// Remove last song input
function removeSongInput() {
    if (songCount <= 1) {
        removeSongBtn.disabled = true;
        return;
    }

    const lastSong = songInputsContainer.lastElementChild;
    if (lastSong) {
        songInputsContainer.removeChild(lastSong);
        songCount--;
    }

    if (songCount <= 1) {
        removeSongBtn.disabled = true;
    }
}

// Open create modal
function openCreateModal() {
    createModal.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    // Reset form
    createPlaylistForm.reset();
    songInputsContainer.innerHTML = '';
    songCount = 0;
    addSongInput(); // Add first song input
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

// Close create modal
function closeCreateModal() {
    createModal.classList.remove('modal-open');
    document.body.style.overflow = '';
}

// Validate duration format
function validateDuration(duration) {
    const pattern = /^[0-9]{1,2}:[0-5][0-9]$/;
    return pattern.test(duration);
}

// Create new playlist
function createNewPlaylist(event) {
    event.preventDefault();

    // Clear previous errors
    document.querySelectorAll('#createPlaylistModal .error-message').forEach(el => el.textContent = '');

    // Get form data
    const playlistName = document.querySelector('#playlistNameInput').value.trim();
    const playlistAuthor = document.querySelector('#playlistAuthorInput').value.trim();

    // Validate playlist details
    if (playlistName.length < 3) {
        document.querySelector('#nameError').textContent = 'Playlist name must be at least 3 characters';
        return;
    }

    if (playlistAuthor.length < 2) {
        document.querySelector('#authorError').textContent = 'Author name must be at least 2 characters';
        return;
    }

    // Collect songs ONLY from the create modal
    const songEntries = document.querySelectorAll('#songInputsContainer .song-entry');
    const songs = [];

    for (let i = 0; i < songEntries.length; i++) {
        const entry = songEntries[i];
        const title = entry.querySelector('.song-title').value.trim();
        const artist = entry.querySelector('.song-artist').value.trim();
        const album = entry.querySelector('.song-album').value.trim() || 'Single';
        const duration = entry.querySelector('.song-duration').value.trim();

        // Validate song data
        if (!title) {
            document.querySelector('#formError').textContent = `Song ${i + 1}: Title is required`;
            return;
        }

        if (!artist) {
            document.querySelector('#formError').textContent = `Song ${i + 1}: Artist is required`;
            return;
        }

        if (!duration || !validateDuration(duration)) {
            document.querySelector('#formError').textContent = `Song ${i + 1}: Duration must be in mm:ss format (e.g., 3:45)`;
            return;
        }

        songs.push({
            id: `song-${Date.now()}-${i}`,
            title,
            artist,
            album,
            duration,
            cover: `https://picsum.photos/60/60?random=${Date.now() + i}`
        });
    }

    // Create playlist object
    const newPlaylist = {
        id: `playlist-${Date.now()}`,
        playlistName,
        playlistAuthor,
        playlistCoverUrl: `https://picsum.photos/300/300?random=${Date.now()}`,
        likeCount: 0,
        isLiked: false,
        songs
    };

    // Add to playlists array
    allPlaylists.push(newPlaylist);

    // Create and append new card
    const card = cardCreation(newPlaylist);
    document.querySelector('#playlistCards').appendChild(card);

    // Close modal
    closeCreateModal();

    // Scroll to new card
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Event listeners
openCreateModalBtn.addEventListener('click', openCreateModal);
closeCreateModalBtn.addEventListener('click', closeCreateModal);
cancelCreateBtn.addEventListener('click', closeCreateModal);
addSongBtn.addEventListener('click', addSongInput);
removeSongBtn.addEventListener('click', removeSongInput);
createPlaylistForm.addEventListener('submit', createNewPlaylist);

// Close modal on backdrop click
createModal.addEventListener('click', (event) => {
    if (event.target === createModal) {
        closeCreateModal();
    }
});

// Edit Playlist functionality
const editModal = document.querySelector('#editPlaylistModal');
const closeEditModalBtn = document.querySelector('#closeEditModalBtn');
const cancelEditBtn = document.querySelector('#cancelEditBtn');
const editPlaylistForm = document.querySelector('#editPlaylistForm');
const editSongInputsContainer = document.querySelector('#editSongInputsContainer');
const editAddSongBtn = document.querySelector('#editAddSongBtn');

let editSongCount = 0;
let currentEditingPlaylist = null;

// Add song input for edit modal
function addEditSongInput(songData = null) {
    if (editSongCount >= 10) {
        document.querySelector('#editFormError').textContent = 'Maximum 10 songs allowed';
        return;
    }

    editSongCount++;
    const songEntry = document.createElement('div');
    songEntry.className = 'song-entry';
    songEntry.innerHTML = `
        <div class="song-entry-header">
            <span>Song ${editSongCount}</span>
            <button type="button" class="song-entry-remove" aria-label="Remove song">&times;</button>
        </div>
        <div class="song-input-row">
            <div class="form-group">
                <label>Title *</label>
                <input type="text" class="song-title" placeholder="Song Title" required value="${songData?.title || ''}">
            </div>
            <div class="form-group">
                <label>Artist *</label>
                <input type="text" class="song-artist" placeholder="Artist Name" required value="${songData?.artist || ''}">
            </div>
        </div>
        <div class="song-input-row">
            <div class="form-group">
                <label>Album</label>
                <input type="text" class="song-album" placeholder="Album Name" value="${songData?.album || ''}">
            </div>
            <div class="form-group">
                <label>Duration (mm:ss) *</label>
                <input type="text" class="song-duration" placeholder="3:45" required pattern="[0-9]{1,2}:[0-5][0-9]" value="${songData?.duration || ''}">
            </div>
        </div>
    `;

    // Add remove button event listener
    const removeBtn = songEntry.querySelector('.song-entry-remove');
    removeBtn.addEventListener('click', () => {
        if (editSongCount <= 1) {
            document.querySelector('#editFormError').textContent = 'Playlist must have at least 1 song';
            return;
        }
        songEntry.remove();
        editSongCount--;
        renumberEditSongs();
        document.querySelector('#editFormError').textContent = '';
    });

    editSongInputsContainer.appendChild(songEntry);
    document.querySelector('#editFormError').textContent = '';
}

// Renumber songs after deletion
function renumberEditSongs() {
    const songEntries = editSongInputsContainer.querySelectorAll('.song-entry');
    songEntries.forEach((entry, index) => {
        const header = entry.querySelector('.song-entry-header span');
        header.textContent = `Song ${index + 1}`;
    });
    editSongCount = songEntries.length;
}

// Open edit modal
function openEditModal(playlist) {
    currentEditingPlaylist = playlist;
    editModal.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    // Reset form
    editPlaylistForm.reset();
    editSongInputsContainer.innerHTML = '';
    editSongCount = 0;
    document.querySelectorAll('#editPlaylistModal .error-message').forEach(el => el.textContent = '');

    // Pre-populate playlist details
    document.querySelector('#editPlaylistNameInput').value = playlist.playlistName;
    document.querySelector('#editPlaylistAuthorInput').value = playlist.playlistAuthor;

    // Pre-populate songs
    playlist.songs.forEach(song => {
        addEditSongInput(song);
    });
}

// Close edit modal
function closeEditModal() {
    editModal.classList.remove('modal-open');
    document.body.style.overflow = '';
    currentEditingPlaylist = null;
}

// Save playlist edits
function savePlaylistEdits(event) {
    event.preventDefault();

    // Clear previous errors
    document.querySelectorAll('#editPlaylistModal .error-message').forEach(el => el.textContent = '');

    // Get form data
    const playlistName = document.querySelector('#editPlaylistNameInput').value.trim();
    const playlistAuthor = document.querySelector('#editPlaylistAuthorInput').value.trim();

    // Validate playlist details
    if (playlistName.length < 3) {
        document.querySelector('#editNameError').textContent = 'Playlist name must be at least 3 characters';
        return;
    }

    if (playlistAuthor.length < 2) {
        document.querySelector('#editAuthorError').textContent = 'Author name must be at least 2 characters';
        return;
    }

    // Collect songs
    const songEntries = document.querySelectorAll('#editSongInputsContainer .song-entry');
    const songs = [];

    for (let i = 0; i < songEntries.length; i++) {
        const entry = songEntries[i];
        const title = entry.querySelector('.song-title').value.trim();
        const artist = entry.querySelector('.song-artist').value.trim();
        const album = entry.querySelector('.song-album').value.trim() || 'Single';
        const duration = entry.querySelector('.song-duration').value.trim();

        // Validate song data
        if (!title) {
            document.querySelector('#editFormError').textContent = `Song ${i + 1}: Title is required`;
            return;
        }

        if (!artist) {
            document.querySelector('#editFormError').textContent = `Song ${i + 1}: Artist is required`;
            return;
        }

        if (!duration || !validateDuration(duration)) {
            document.querySelector('#editFormError').textContent = `Song ${i + 1}: Duration must be in mm:ss format (e.g., 3:45)`;
            return;
        }

        // Preserve existing song ID if available, otherwise generate new one
        const existingSong = currentEditingPlaylist.songs[i];
        songs.push({
            id: existingSong?.id || `song-${Date.now()}-${i}`,
            title,
            artist,
            album,
            duration,
            cover: existingSong?.cover || `https://picsum.photos/60/60?random=${Date.now() + i}`
        });
    }

    // Update playlist object
    currentEditingPlaylist.playlistName = playlistName;
    currentEditingPlaylist.playlistAuthor = playlistAuthor;
    currentEditingPlaylist.songs = songs;

    // Re-render all playlists to update the edited card
    renderPlaylist(allPlaylists);

    // Close modal
    closeEditModal();
}

// Event listeners for edit modal
closeEditModalBtn.addEventListener('click', closeEditModal);
cancelEditBtn.addEventListener('click', closeEditModal);
editAddSongBtn.addEventListener('click', () => addEditSongInput());
editPlaylistForm.addEventListener('submit', savePlaylistEdits);

// Close edit modal on backdrop click
editModal.addEventListener('click', (event) => {
    if (event.target === editModal) {
        closeEditModal();
    }
});

// Delete playlist function
function deletePlaylist(playlist) {
    // Confirm deletion
    const confirmDelete = confirm(`Are you sure you want to delete "${playlist.playlistName}"? This action cannot be undone.`);

    if (!confirmDelete) {
        return;
    }

    // Find index of playlist in allPlaylists array
    const playlistIndex = allPlaylists.findIndex(p => p.id === playlist.id);

    if (playlistIndex !== -1) {
        // Remove from data model
        allPlaylists.splice(playlistIndex, 1);

        // Re-render all playlists to update the display
        renderPlaylist(allPlaylists);
    }
}

// Sort functionality
const sortSelect = document.querySelector('#sortSelect');

function sortPlaylists(playlists, method) {
    // Create a copy to avoid mutating the original array
    const sortedPlaylists = [...playlists];

    switch (method) {
        case 'name':
            // Sort alphabetically by name (A-Z)
            sortedPlaylists.sort((a, b) => {
                return a.playlistName.toLowerCase().localeCompare(b.playlistName.toLowerCase());
            });
            break;

        case 'likes':
            // Sort by likes (high to low), with name as tiebreaker
            sortedPlaylists.sort((a, b) => {
                if (b.likeCount !== a.likeCount) {
                    return b.likeCount - a.likeCount; // Sort by likes descending
                }
                // Tiebreaker: sort alphabetically by name
                return a.playlistName.toLowerCase().localeCompare(b.playlistName.toLowerCase());
            });
            break;

        case 'dateAdded':
        default:
            // Sort by date added (newest first - maintains order from JSON)
            // Since playlists are added to the end of the array, reverse shows newest first
            sortedPlaylists.reverse();
            break;
    }

    return sortedPlaylists;
}

// Search functionality
const searchInput = document.querySelector('.header-search');
const searchClearBtn = document.querySelector('.search-clear-btn');

function searchPlaylists(query) {
    // Convert query to lowercase for case-insensitive search
    const searchQuery = query.toLowerCase().trim();

    // Show/hide clear button based on whether there's text
    if (searchQuery !== '') {
        searchClearBtn.classList.add('show');
    } else {
        searchClearBtn.classList.remove('show');
    }

    // Start with all playlists
    let playlistsToDisplay = allPlaylists;

    // If search is not empty, filter playlists
    if (searchQuery !== '') {
        playlistsToDisplay = allPlaylists.filter(playlist => {
            const nameMatch = playlist.playlistName.toLowerCase().includes(searchQuery);
            const authorMatch = playlist.playlistAuthor.toLowerCase().includes(searchQuery);
            return nameMatch || authorMatch;
        });
    }

    // Apply current sort method
    const sortedPlaylists = sortPlaylists(playlistsToDisplay, currentSortMethod);

    // Render sorted and filtered playlists
    renderPlaylist(sortedPlaylists);
}

// Add event listener for search input
searchInput.addEventListener('input', (event) => {
    searchPlaylists(event.target.value);
});

// Add event listener for clear button
searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchClearBtn.classList.remove('show');
    searchPlaylists('');
});

// Add event listener for sort dropdown
sortSelect.addEventListener('change', (event) => {
    currentSortMethod = event.target.value;
    // Re-apply search with new sort method
    searchPlaylists(searchInput.value);
});

// Close all menu dropdowns when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.playlist-card-menu')) {
        document.querySelectorAll('.playlist-card-menu-dropdown.show').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
});

loadPlaylists();