const firebase = require("firebase");

const firebaseConfig = {
    apiKey: "AIzaSyAGeKbRZW_WHgDrbIYclh-sVaCEn9RPQTc",
    databaseURL: "https://thoomin-spotify-app.firebaseio.com",
};

firebase.initializeApp(firebaseConfig);

// GET THIS FROM COOKIES.
// const thoominToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTU3NDc4NDkwOCwiZXhwIjoxNTc0Nzg4NTA4LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1ma2ltaEB0aG9vbWluLXNwb3RpZnktYXBwLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstZmtpbWhAdGhvb21pbi1zcG90aWZ5LWFwcC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6InNwb3RpZnk6dXNlcjpzaXJtaXN0ZXJ5In0.LQqjjVB75dQcRVoVd2q0JqZHjXcw8JAuOFZeZgMMFC3Dz8jga-It-WIgffKtd_MgeQpX4TTuWQIiD6wq_B5QJEWHYZHemgqpbFWNvBu1QvXXW-BZ3iqTUyRZc1GRxpIPIoQLk7c0JcvE8kQFKGMDvS6Vcuq0rFUhkvO2CVjnXMlOfKCODUYsFoDxQo9ilGqWvey_ICxTgKSC3LXd7a0kQYeWGSb9C87FSoZcI0UuWekIqE2-uS2rl3bD9rv9vuF8p-BT_uo3Dl7KC6v-iZSZBYpsglcpSxV5le-Uu7rmDo63m_WIjIW9RgHHvZc6dQPUW170Rw_hD5pSOHErrlMQpg';
// const credential = firebase.auth.EmailAuthProvider.credential('ntorressm@gmail.com', 'testpassword123');

// Sign In w/ custom token.
firebase.auth().signInWithEmailAndPassword('ntorressm@gmail.com', 'testpassword123')
.then(blah => {
    return firebase.auth().currentUser.getIdToken(true);
})
.then(idToken => {
    console.log(idToken);
    return idToken;
})
.catch(error => {
    console.log(error);
});

/////// LATER ON IN THE CODE

function getAccessToken() {
    firebase.auth().currentUser.getIdToken(true).then(idToken => {
        // POST https://thoominspotify.com/api/user/accessToken
        //  {
        //      "thoominToken" : idToken
        //  }
        //

        console.log("TOKEN " + idToken);
        return idToken;
    })
    .catch(error => {
        console.log(error);
    })
}