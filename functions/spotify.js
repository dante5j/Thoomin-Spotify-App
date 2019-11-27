const request = require('request');
const querystring = require('querystring');

require('dotenv').config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
let REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

const MAX_ACCESS_TOKEN_TIME = 3600/10;
let accessToken = null;

let counter = MAX_ACCESS_TOKEN_TIME;
setInterval(countDown, 1000);

function setRedirectURI(redirectURI) {
	REDIRECT_URI = redirectURI;
}

function createPlaylist(accessToken, playlistName) {
	return new Promise((resolve, reject) => {
		getSpotifyUser(accessToken).then(spotifyUser => {
			const userId = spotifyUser.id;

			const options = {
				url: 'https://api.spotify.com/v1/users/' + userId + '/playlists',
				headers: {'Authorization' : 'Bearer ' + accessToken},
				json: {
					name: playlistName,
					description: 'Playlist created w/ thoominspotify.com'
				}
			}

			request.post(options, (error, response, body) => {
				if (error || (response.statusCode !== 201 && response.statusCode !== 200)) {
					console.log("ERROR: " + JSON.stringify(body));
					console.log("STATUS CODE: " + response.statusCode);
					reject(new Error("Can't create playlist."));
				} else {
					resolve(body);
				}
			});

			return;
		})
		.catch(error => {
			console.log(error);
			resolve(error);
		})
	});
}

function countDown() {
	counter++;
}

function getTracksByIds(trackIds) {
	return new Promise((resolve, reject) => {
		if (!Array.isArray(trackIds)) {
			reject(new Error("TrackIds field not an array."));
		} else {
			let tracks = '';
			for (let i = 0; i < trackIds.length; i++) {
				tracks += trackIds[i];
				tracks += (i === (trackIds.length - 1)) ? '' : ',';
			}

			getAccessToken()
			.then(accessToken => {
				const options = {
					url: 'https://api.spotify.com/v1/tracks/?' +
						querystring.stringify({
							ids: tracks
						}),
					headers: {
					  'Authorization': 'Bearer ' + accessToken
					},
					json: true
				};

				console.log(options.url);

				request.get(options, (error, response, body) => {
					if (error || response.statusCode !== 200) {
						reject(new Error(JSON.stringify(body)));
					} else {
						let listOfTracks = [];

						for (let i = 0; i < body.tracks.length; i++) {
							if (body.tracks[i] === null) {
								listOfTracks.push(null);
							} else {
								let artists = [];
								body.tracks[i].artists.forEach(artist => artists.push(artist.name));

								listOfTracks.push({
									id: body.tracks[i].id,
									name: body.tracks[i].name,
									artists: artists,
									image: body.tracks[i].album.images[0].url
								});
							}
						}

						resolve(listOfTracks);
					}
				});

				return accessToken;
			})
			.catch(error => {
				reject(error);
			})
		}
	});
}

/**
 * 
 * @param {string} code
 * 
 * @returns {Promise<string>} accessToken
 */
function getTokensFromCode(code) {
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
				resolve({
					accessToken : body.access_token,
					refreshToken : body.refresh_token
				});
			}
		});
	});
}

/**
 * 
 * @param {string} userAccessToken
 * 
 * @returns {Promise<object>} SpotifyUser
 */

function getSpotifyUser(userAccessToken) {
	const options = {
		url: 'https://api.spotify.com/v1/me',
		headers: { 'Authorization': 'Bearer ' + userAccessToken },
		json: true
	};

	return new Promise((resolve, reject) => {
		request.get(options, (error, response, body) => {
			if (error || response.statusCode !== 200) {
				reject(new Error("Could not find account."));
			} else {
				resolve({
					id: body.id,
					uri: body.uri,
					name: body.name,
					email: body.email,
					image: body.image ? body.image[0].url : '',
					premium: body.product === 'premium'
				});
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

			const authOptions = {
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


/*
	TODO: Remove OLD functions
*/

/**
 * 
 * @param {string} trackId - A track's Spotify id
 * 
 * @return {Promise<Object>}
 */
function getTrackByIdOld(trackId) {
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

function getAccessTokenFromRefreshToken(refreshToken) {
	return new Promise((resolve, reject) => {
		const authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			headers: {'Authorization' : 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString("base64")},
			form: {
				grant_type: 'refresh_token',
				refresh_token: refreshToken
			},
			json: true
		}

		request.post(authOptions, (error, response, body) => {
			if (error || response.statusCode !== 200) {
				reject(new Error("Can't get refresh token."));
			} else {
				resolve(body.access_token);
			}
		})
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

module.exports = {
	getTrackByIdOld: function(trackId) {
		return getTrackByIdOld(trackId);
	},
	getAccessToken: function() {
		return getAccessToken();
	},
	getTokensFromCode: function(code) {
		return getTokensFromCode(code);
	},
	getSpotifyUser: function(userAccessToken) {
		return getSpotifyUser(userAccessToken);
	},
	getTracksByIds: function(trackIds) {
		return getTracksByIds(trackIds);
	},
	getAccessTokenFromRefreshToken: function(refreshToken) {
		return getAccessTokenFromRefreshToken(refreshToken);
	},
	setRedirectURI: function(redirectURI) {
		return setRedirectURI(redirectURI);
	},
	createPlaylist: function(accessToken, playlistName) {
		return createPlaylist(accessToken, playlistName);
	}
}