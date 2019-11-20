const firebase = require("firebase");

require('dotenv').config();

const serviceAccount = require(process.env.SERVICE_ACCOUNT_URL);

firebase.initializeApp({
	serviceAccount: serviceAccount
});

function createFirebaseToken(spotifyURI) {
	return firebase.auth().createFirebaseToken(spotifyURI);
}

function getFirebaseToken(userInfo) {
	const accessToken = userInfo.accessToken;
	const spotifyURI = userInfo.spotifyURI;
	const displayName = userInfo.displayName;
	const profilePic = userInfo.profilePic;

	const firebaseToken = createFirebaseToken(spotifyURI);
}