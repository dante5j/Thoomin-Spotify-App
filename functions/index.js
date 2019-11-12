const functions = require('firebase-functions');
const firebase = require("firebase");
const express = require('express');
const querystring = require('querystring');
const cors = require('cors');
const request = require('request');
// const cors = require('cors')({origin: true});

const API_KEY = "AIzaSyAGeKbRZW_WHgDrbIYclh-sVaCEn9RPQTc";

firebase.initializeApp({
	apiKey: API_KEY,
	databaseURL: "https://thoomin-spotify-app.firebaseio.com"
});

const app = express();
const stateKey = 'spotify_auth_state';
const CLIENT_ID = "39b0423f2b094cf5b4609737348f2a52";
const CLIENT_SECRET = "f0e251b203ee4cc4bd32449be22d48fe";
const REDIRECT_URI = "https://thoominspotify.com/api/user/callback";

app.use(cors());

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

app.get('/api/user/callback', (req, res) => {
  const code = req.query.code || null;

  // Check for state
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;

      const options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };

      // use the access token to access the Spotify Web API
      request.get(options, (error, response, body) => {
        console.log(body);
      });

      // we can also pass the token to the browser to make requests from there
      res.redirect('/#' +
        querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token
        }));
    } else {
      response.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
    }
  });
});

/*
app.post('/api/user/verifyemail', (req, res) => {
  const userEmail = req.body.userEmail;
  const userPassword = req.body.userPassword;

  if (!userEmail) {
    res.status(400).json({"message": "Email required for creating user."});
  } else if (!userPassword) {
    res.status(400).json({"message": "Password required for creating user."});
  } else {
    authService.signInWithEmailAndPassword(userEmail, userPassword)
    .then(user => {
      const firebaseUser = authService.currentUser;
      
      firebaseUser.sendEmailVerification().then(function() {
        res.status(200).json({message: "Successfully send email verification to " + userEmail + "."});
        
        return null;
      }).catch(error => {
        res.status(400).json({message: "Failed to send email verification."});
      });

      return null;
    })
    .catch(error => {
      const errorMessage = error.message;
      const errorCode = error.code;
      res.status(400).json({message: errorMessage, code: errorCode});
    });
  }
});

// Sign in user
app.post('/api/user/login', (req, res) => {
  const userEmail = req.body.userEmail;
  const userPassword = req.body.userPassword;

  if (!userEmail) {
    res.status(400).json({"message": "Email required for creating user."});
  } else if (!userPassword) {
    res.status(400).json({"message": "Password required for creating user."});
  } else {
    authService.signInWithEmailAndPassword(userEmail, userPassword)
    .then(user => {
      const firebaseUser = authService.currentUser;

      res.status(200).json({message: "Successfully signed in", user: user, firebaseUser: firebaseUser});
      return null;
    })
    .catch(error => {
      const errorMessage = error.message;
      const errorCode = error.code;
      res.status(400).json({message: errorMessage, code: errorCode});
    });
  }
});

*/

app.get('/api/helloworld', (req, res) => {
    return res.status(200).json({"message":"EXPRESS WORKS!!!"});
});

exports.app = functions.https.onRequest(app);