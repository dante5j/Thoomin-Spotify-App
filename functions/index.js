const functions = require('firebase-functions');
const firebase = require("firebase");
const express = require('express');
const querystring = require('querystring');
const cors = require('cors');
const request = require('request');
const spotify = require('./spotify');

require('dotenv').config();

const env = process.env;

firebase.initializeApp({
	apiKey: env.WEB_API_KEY,
	databaseURL: env.DATABASE_URL
});

const app = express();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const VERSION = "0.0.5";

app.use(cors());

app.get('/api/spotify/auth', (req, res) => {
  spotify.getAccessToken()
  .then(accessToken => {
    res.status(200).json({accessToken: accessToken});
    return accessToken;
  })
  .catch(error => {
    res.status(400).json({error: error.message});
  });
});

app.post('/api/spotify/track', (req, res) => {
  const trackId = req.body.trackId;

  if (!trackId) {
    res.status(400).json({error: "Missing trackId."});
  } else {
    spotify.getTrackById(trackId)
    .then(trackInfo => {
      res.status(200).json(trackInfo);
      return trackInfo;
    })
    .catch(error => {
      res.status(400).json({error: error.message});
    })
  }
});

// Returns current version of the API.
app.get('/api/version', (req, res) => {
  res.status(200).json({version: VERSION});
});

// Create user.
app.get('/api/user/login', (req, res) => {
  // TODO: State cookie integration to prevent spam.
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
    }));
});

function createFirebaseToken(spotifyURI) {
	return firebase.auth().createCustomToken(spotifyURI);
}

app.get('/api/user/callback', (req, res) => {
  const code = req.query.code || null;

  // TODO: Check for state
  spotify.loginCallbackUser(code)
  .then((userInfo) => {
	// Add it to the database
	const accessToken = userInfo.accessToken;
	const spotifyURI = userInfo.spotifyURI;
	const displayName = userInfo.displayName;
	const profilePic = userInfo.profilePic;

	const firebaseToken = createFirebaseToken(spotifyURI);

	// Redirect them to thoomin.
	res.redirect("https://thoominspotify.com/home/");
	return userInfo;
  })
  .catch(error => {
	res.status(400).json(error.message);
  })
});

app.get('/api/helloworld', (req, res) => {
    return res.status(200).json({"message":"EXPRESS WORKS!!!"});
});

exports.app = functions.https.onRequest(app);