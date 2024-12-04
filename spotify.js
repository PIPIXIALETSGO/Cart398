const clientId = '7ca4f344d391489795cbf671b436c527';
const redirectUri = 'http://127.0.0.1:5500/index.html';
let accessToken;

function authenticateSpotify() {
  const scopes = 'user-read-playback-state user-modify-playback-state streaming';
  const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  window.location.href = authUrl;  // This triggers the redirect to Spotify
}

function handleAuthRedirect() {
  // Check if there's already an access token in the URL fragment
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  accessToken = params.get('access_token');
    console.log(accessToken)
  // If we have the access token, stop refreshing
  if (accessToken) {
    console.log('Spotify authentication successful!');
    window.location.hash = ''; // Clear the URL hash to prevent refresh
  } else {
    console.log('Access token not found, triggering authentication...');
    authenticateSpotify(); // If no token, trigger authentication again
  }
}

// Function to search and play the song based on the classifier result
function searchSpotify(keyword) {
  fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(keyword)}&type=track&limit=1`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      const track = data.tracks.items[0];
      if (track) {
        console.log('Song Info:');
        console.log(`Track: ${track.name}`);
        console.log(`Artist: ${track.artists.map(artist => artist.name).join(', ')}`);
        console.log(`Album: ${track.album.name}`);
        console.log(`Track URI: ${track.uri}`);
        console.log(`Preview URL: ${track.preview_url}`);
        console.log(`Playing track: ${track.name}`);
        const nowPlayingDiv=document.getElementById("songInfo")
        const titleDiv=document.createElement('div')
        const artistDiv=document.createElement('div')
        const title=track.name
        const artist=track.artists.map(artist => artist.name).join(', ')
        titleDiv.textContent=title
        artistDiv.textContent=`by ${artist}`
        nowPlayingDiv.append(titleDiv,artistDiv);         
        playTrack(track.uri);
     
      }
    })
    .catch(console.error);
}

function playTrack(trackUri) {
  fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris: [trackUri] }),
  })
    .then(() => console.log('Track is playing'))
    .catch(console.error);  
}

// If the access token exists in the URL fragment, handle the redirect and stop refreshing
if (window.location.hash) {
  handleAuthRedirect();
}

// If there's no access token, trigger the authentication
if (!accessToken) {
  authenticateSpotify();
}
