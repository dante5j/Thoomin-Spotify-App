const admin = require('firebase-admin');

require('dotenv').config();

const serviceAccount = require(process.env.SERVICE_ACCOUNT_URL);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://thoomin-spotify-app.firebaseio.com"
});

function createFirebaseToken(spotifyUID) {
	return new Promise ((resolve, reject) => {
		admin.auth().createCustomToken(spotifyUID).then(customToken => {
			resolve(customToken);
			return customToken;
		})
		.catch(error => {
			reject(new Error("Unable to create firebase token."));
		});
	});
}

/**
 * 
 */
function createParty(idToken) {
	return new Promise((resolve, reject) => {
		admin.auth().verifyIdToken(idToken)
		.then(decodedToken => {

			
			return decodedToken;
		})
		.catch(error => {

		});
	});
}

function getRandomPartyId() {
	
}

module.exports = {
	createFirebaseToken: function(spotifyURI) {
		return createFirebaseToken(spotifyURI);
	}
}