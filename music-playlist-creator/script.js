const btn = document.querySelector(".modal-close");
const modalOverlay = document.querySelector("#modalOverlay");

btn.addEventListener("click", () => {
    console.log("Button clicked");
    modalOverlay.style.display = "none";
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