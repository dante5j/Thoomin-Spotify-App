const request = require('request');

require('dotenv').config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

const MAX_ACCESS_TOKEN_TIME = 3600/10;
let accessToken = null;

let counter = MAX_ACCESS_TOKEN_TIME;
setInterval(countDown, 1000);

function countDown() {
	counter++;
}

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

function loginCallbackUser(code) {
	const authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
		  code: code,
		  redirect_uri: REDIRECT_URI,
		  grant_type: 'authorization_code'
		},
		headers: {
		  'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString("base64")
		},
		json: true
	};

	return new Promise((resolve, reject) => {
		request.post(authOptions, (error, response, body) => {
			if (error || response.statusCode !== 200) {
				reject(new Error("Unable to authenticate using Spotify."));
			} else {
				const userAccessToken = body.access_token;
				// const userRefreshToken = body.refresh_token;
		
				const options = {
					url: 'https://api.spotify.com/v1/me',
					headers: { 'Authorization': 'Bearer ' + userAccessToken },
					json: true
				};
		
				// use the access token to access the Spotify Web API
				request.get(options, (error, response, body) => {
					if (error || response.statusCode !== 200) {
						reject(new Error("Could not find account."));
					} else if (body.type !== 'user') {
						reject(new Error("Incorrect account type."));
					} else if (body.product !== 'premium') {
						reject(new Error("Account not premium"));
					} else {
						resolve({
							accessToken : body.access_token,
							spotifyURI : body.uri,
							profilePic : body.images[0],
							displayName : body.display_name
						});
					}
				});
			}
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
	return new Promise((resolve, reject) => {
		if (counter < MAX_ACCESS_TOKEN_TIME && accessToken !== null) {
			resolve(accessToken);
		} else {
			counter = 0;

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
	
			request.post(authOptions, (error, response, body) => {
				if (!error && response.statusCode === 200) {
					accessToken = body.access_token;
					resolve(body.access_token);
				} else {
					reject(new Error("Authentication failure."));
				}
			});
		}
	});
}

module.exports = {
	getTrackById: function(trackId) {
		return getTrackById(trackId);
	},
	getAccessToken: function() {
		return getAccessToken();
	},
	loginCallbackUser: function(code) {
		return loginCallbackUser(code);
	}
}
