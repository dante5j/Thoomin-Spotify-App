const spotify = require("./spotify");

spotify.getTrackById("6HzZ4yv9xANHwgcQbMNHvR")
.then(track => {
	console.log(track);
	return;
})
.catch(error => {
	console.log(error);
	return;
})