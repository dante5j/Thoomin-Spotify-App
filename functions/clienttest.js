const firebase = require("firebase");

const database = require("./database");
const spotify = require('./spotify');

const firebaseConfig = {
    apiKey: "AIzaSyAGeKbRZW_WHgDrbIYclh-sVaCEn9RPQTc",
    databaseURL: "https://thoomin-spotify-app.firebaseio.com",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

spotify.getSpotifyUserInfo(accessToken).then(info => {
    console.log(info);
    return database.createFirebaseToken(info.uri);
})
.then(customToken => {
    console.log(customToken);
    return firebase.auth().signInWithCustomToken(customToken);
})
.then(thing => {
    console.log(thing);
    return thing;
})
.catch(error => {
    console.log(error);
});