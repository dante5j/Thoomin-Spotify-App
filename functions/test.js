const spotify = require("./spotify");
const database = require("./database");
const firebase = require("firebase");

spotify.getSpotifyUserInfo("BQAFmLExjrMp6P_Jb6oYkhIoSFKvXEDsPnnMKwf-0tEQatK200ThOnekN9a5DPGj-mCHJGpagcgd5nJEcn7JmCijx9WFnij3cMdT_UFjdGcJ-roHC3mGT-PuhiHaszFrDjAivRZD-uaaga0OFxACJR6JrT-3l-6FPQ")
.then(thing => {
	console.log(thing);
	return thing;
}).catch(error => {
	console.log(error);
})