// Select random playlist function
function selectRandomPlaylist(playlists) {
    // Generate random index
    const randomIndex = Math.floor(Math.random() * playlists.length);
    // Return randomly selected playlist
    return playlists[randomIndex];
}

// Render featured page function
function renderFeaturedPage(playlist) {
    // 1. Update cover image
    const coverImg = document.querySelector('.featured-cover');
    coverImg.src = playlist.playlistCoverUrl;
    coverImg.alt = `${playlist.playlistName} cover`;

    // 2. Update playlist name
    const playlistName = document.querySelector('.featured-name');
    playlistName.textContent = playlist.playlistName;

    // 3. Update author
    const author = document.querySelector('.featured-author');
    author.textContent = playlist.playlistAuthor;

    // 4. Update like count
    const likeCount = document.querySelector('.featured-like-count');
    likeCount.textContent = playlist.likeCount;

    // 5. Set liked state
    const heartButton = document.querySelector('.featured-heart');
    if (playlist.isLiked) {
        heartButton.classList.add('featured-heart--liked');
    } else {
        heartButton.classList.remove('featured-heart--liked');
    }

    // 6. Clear existing tracklist
    const tracklist = document.querySelector('.featured-tracklist');
    tracklist.innerHTML = '';

    // 7. Loop through songs array with index
    playlist.songs.forEach((song, index) => {
        const songItem = document.createElement('li');
        songItem.className = 'modal-song-item'; // Reuse modal song styling

        songItem.innerHTML = `
            <span class="featured-track-number">${index + 1}</span>
            <img src="${song.cover}" alt="${song.title} cover" class="modal-song-cover">
            <div class="modal-song-info">
                <p class="modal-song-title">${song.title}</p>
                <p class="modal-song-artist">${song.artist}</p>
                <p class="modal-song-album">${song.album}</p>
            </div>
            <span class="modal-song-duration">${song.duration}</span>
        `;

        tracklist.appendChild(songItem);
    });

    // 8. Add event listener to heart button for like toggle
    heartButton.addEventListener('click', () => {
        toggleLike(playlist, heartButton, likeCount);
    });
}

// Like toggle function (same as main page)
function toggleLike(playlist, heartButton, likeCountSpan) {
    if (playlist.isLiked) {
        // PREVIOUSLY LIKED → UNLIKE
        playlist.isLiked = false;
        playlist.likeCount--;
        heartButton.classList.remove('featured-heart--liked');
        likeCountSpan.textContent = playlist.likeCount;
    } else {
        // PREVIOUSLY UNLIKED → LIKE
        playlist.isLiked = true;
        playlist.likeCount++;
        heartButton.classList.add('featured-heart--liked');
        likeCountSpan.textContent = playlist.likeCount;
    }
}

// Load featured playlist on page load
async function loadFeaturedPlaylist() {
    try {
        // 1. Fetch data from data.json
        const response = await fetch('./data/data.json');
        const data = await response.json();

        // 2. Select random playlist
        const randomPlaylist = selectRandomPlaylist(data.playlists);

        // 3. Render the featured page
        renderFeaturedPage(randomPlaylist);
    } catch (error) {
        console.error('Error loading featured playlist:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Failed to load featured playlist. Please try again later.';
        errorMessage.style.color = '#e74c3c';
        errorMessage.style.textAlign = 'center';
        document.querySelector('.featured-page').appendChild(errorMessage);
    }
}

// Run on page load
loadFeaturedPlaylist();
