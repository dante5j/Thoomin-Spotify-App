const request = require('request');

require('dotenv').config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

function getTrackById(trackId) {
	// use the access token to access the Spotify Web API
	return new Promise((resolve, reject) => {
		getAccessToken()
		.then(accessToken => {
			return getTrackInfo(accessToken, trackId);
		})
		.then(trackInfo => {
			resolve(trackInfo);
			return;
		})
		.catch(error => {
			reject(error);
		});
	});
}

function getTrackInfo(accessToken, trackId) {
	const options = {
		url: 'https://api.spotify.com/v1/tracks/' + trackId ,
		headers: {
		  'Authorization': 'Bearer ' + accessToken
		},
		json: true
	};

	return new Promise((resolve, reject) => {
		request.get(options, (error, response, body) => {
			if (!error) {
				let artistsNames = [];
				body.artists.forEach(artist => artistsNames.push(artist.name));

				const trackInfo = {
					songName : body.name,
					artistsNames : artistsNames,
					imageURL : body.album.images[0].url
				}

				resolve(trackInfo);
			} else {
				reject(new Error("Could not get track."));
			}
		});
	});
}

// Returns a string containing an access token
// Returns null if unsuccessful
function getAccessToken() {
	// Options for requesting a Spotify Client access token
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: {
		  'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString("base64")
		},
		form: {
		  grant_type: 'client_credentials'
		},
		json: true
	};

	return new Promise((resolve, reject) => {
		request.post(authOptions, (error, response, body) => {
			if (!error && response.statusCode === 200) {
				resolve(body.access_token);
			} else {
				reject(new Error("Authentication failure."));
			}
		});
	});
}

module.exports = {
	getTrackById: function(trackId) {
		return getTrackById(trackId);
	},
	getAccessToken: function() {
		return getAccessToken();
	}
}
