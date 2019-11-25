const functions = require('firebase-functions');
const firebase = require("firebase");
const express = require('express');
const querystring = require('querystring');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const spotify = require('./spotify');
const database = require('./database');

require('dotenv').config();

firebase.initializeApp({
	apiKey: process.env.WEB_API_KEY,
	databaseURL: process.env.DATABASE_URL
});

const app = express();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const VERSION = "0.0.5";

app.use(cors());
app.use(cookieParser());

/**
 * 
 */
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

/**
 * 
 */
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

/**
 * 
 */
app.get('/api/version', (req, res) => {
  res.status(200).json({version: VERSION});
});

/**
 * 
 */
app.get('/api/user/login', (req, res) => {
  // TODO: State cookie integration to prevent spam.
  const scope = 'user-read-private user-read-email';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
    }));
});

/**
 * 
 */
app.get('/api/user/callback', (req, res) => {
  const code = req.query.code || null;

  spotify.getAccessTokenFromCode(code)
  .then((accessToken) => {
    res.cookie("spotifyAccessToken", accessToken);
	  return spotify.getSpotifyUserInfo(accessToken);
  })
  .then(spotifyUserInfo => {
    return database.createFirebaseToken(spotifyUserInfo.uri);
  })
  .then(thoominAccessToken => {
    console.log("Thoomin Access Token " + thoominAccessToken);
    res.cookie("thoominAccessToken", thoominAccessToken).redirect("https://thoominspotify.com/home");
    return thoominAccessToken;
  })
  .catch(error => {
	  res.status(400).json({error : error.message});
  });
});

/**
 * 
 */
app.post('/api/user/accessToken', (req, res) => {
  const code = req.body.code || null;

  // TODO: Check for state
});

/**
 * 
 */
app.get('/api/helloworld', (req, res) => {
  res.status(200).json({"message":"EXPRESS WORKS!!!"});
});

exports.app = functions.https.onRequest(app);