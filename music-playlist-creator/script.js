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

function cardCreation(playlist) {
    console.log("In cardCreation function");
    const playlistCard = document.createElement("article");
    playlistCard.classList.add("playlist-card");
    playlistCard.innerHTML = `
        <img src="${playlist.playlistCoverUrl}" alt="${playlist.playlistName}" class="playlist-card-cover">
        <h3 class="playlist-card-name">${playlist.playlistName}</h3>
        <p class="playlist-card-author">${playlist.playlistAuthor}</p>
        <div class="playlist-card-footer">
            <button class="playlist-card-heart" aria-label="Like playlist">♡</button>
            <span class="playlist-card-like-count">${playlist.likeCount}</span>
        </div>
    `;

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
        renderPlaylist(data.playlists);
    } catch (error) {
        console.error("Error loading playlists:", error);
        // Optionally display an error message to the user
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Failed to load playlists. Please try again later.";
        document.body.appendChild(errorMessage);
    }
}

loadPlaylists();