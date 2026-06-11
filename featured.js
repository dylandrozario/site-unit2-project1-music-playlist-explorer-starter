// AI playlist description constants
const DESCRIPTION_SYSTEM_PROMPT = `You are a music curator writing playlist descriptions.

Output format: 2-3 sentences, max 60 words, casual conversational tone.

Constraints:
- Describe the overall mood, vibe, and theme
- Mention what activities or moments this suits
- Do not list individual songs or artists
- Do not use marketing language like "perfect" or "ultimate"`;

const DESCRIPTION_FAILURE_MESSAGE = "Description unavailable — try again in a moment.";

// AI playlist description function (same as in script.js)
async function getPlaylistDescription(playlist) {
    // Check if API key exists
    if (typeof API_KEY === 'undefined' || !API_KEY) {
        console.error('API key not found');
        return DESCRIPTION_FAILURE_MESSAGE;
    }

    try {
        // Construct the user message with THIS PLAYLIST'S data only
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

        // Safely extract description with optional chaining - NO CACHING
        const description = data?.choices?.[0]?.message?.content?.trim() || DESCRIPTION_FAILURE_MESSAGE;

        return description;

    } catch (error) {
        console.error('getPlaylistDescription failed:', error);
        return DESCRIPTION_FAILURE_MESSAGE;
    }
}

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
