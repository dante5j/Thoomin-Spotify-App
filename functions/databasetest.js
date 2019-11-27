const database = require('./database');

const firebase = require("firebase");

const firebaseConfig = {
    apiKey: "AIzaSyAGeKbRZW_WHgDrbIYclh-sVaCEn9RPQTc",
    databaseURL: "https://thoomin-spotify-app.firebaseio.com",
};

firebase.initializeApp(firebaseConfig);

const spotifyUser = {
	id: 'test_id',
	uri: 'test_uri1',
	name: 'test_name',
	email: 'test_em12ail@email.com',
	premium: true
};

const fakeRefreshToken = 'fakeRefreshToken321';

database.loginThoominUser(spotifyUser, fakeRefreshToken)
.then(thoominToken => {
	console.log(thoominToken);
	return firebase.auth().signInWithCustomToken(thoominToken);
})
.then(blah => {
	console.log("LOGGED IN!!!");
	return firebase.auth().currentUser.getIdToken(true);
})
.then(idToken => {
	console.log("SENDING idToken TO SERVER");
	return database.getRefreshToken(idToken);
})
.then(refreshToken => {
	console.log("REFRESH TOKEN FROM DB: " + refreshToken);
	return refreshToken;
})
.catch(error => {
	console.log(error);
})