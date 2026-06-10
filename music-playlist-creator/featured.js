// AI playlist description function (same as in script.js)
async function getPlaylistDescription(playlist) {
    // Check if description is already cached
    if (playlist.aiDescription && playlist.aiDescription.length > 0) {
        return playlist.aiDescription;
    }

    // Check if API key exists
    if (typeof API_KEY === 'undefined' || !API_KEY) {
        console.error('API key not found');
        return `${playlist.playlistName} - A curated collection of songs by ${playlist.playlistAuthor}.`;
    }

    try {
        // Construct the prompt
        const songList = playlist.songs
            .map(song => `- ${song.title} by ${song.artist}`)
            .join('\n');

        const prompt = `You are a music curator writing playlist descriptions. Write a 2-3 sentence description for this playlist that captures its mood and vibe.

Playlist: "${playlist.playlistName}"
Creator: "${playlist.playlistAuthor}"
Songs:
${songList}

Guidelines:
- Describe the overall mood, vibe, and theme
- Mention what activities or moments this suits
- Don't list individual songs or artists
- Use casual, conversational tone
- Keep it to 2-3 sentences (40-80 words)`;

        // Make API call with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Music Playlist Explorer'
            },
            body: JSON.stringify({
                model: 'google/gemma-4-26b-a4b-it:free',
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                max_tokens: 1500
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.status === 429) {
            console.warn('API rate limit exceeded - free tier has request limits');
            return `${playlist.playlistName} curated by ${playlist.playlistAuthor}. Rate limit reached - please try again in a moment.`;
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error: ${response.status}`, errorText);
            return `Experience the vibe of ${playlist.playlistName}. Perfect for any moment when you need the right soundtrack.`;
        }

        const data = await response.json();
        const description = data.choices?.[0]?.message?.content?.trim();

        if (!description || description.length === 0) {
            console.warn('Empty description received from API');
            return `Discover ${playlist.playlistName} curated by ${playlist.playlistAuthor}. A handpicked selection of tracks for your listening pleasure.`;
        }

        playlist.aiDescription = description;
        return description;

    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('API request timeout');
            return `${playlist.playlistName} brings together the perfect mix of tracks. Enjoy the curated experience.`;
        }

        console.error('Error getting playlist description:', error);
        return `Explore ${playlist.playlistName} by ${playlist.playlistAuthor}. Each track carefully selected to create the perfect atmosphere.`;
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
