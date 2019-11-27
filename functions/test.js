const spotify = require("./spotify");
const database = require("./database");
const firebase = require("firebase");

const code = "AQD-yxm3d1TLj_hU7yiSi6ym18fjUdQZ6WsrnsjAJTnXbEKMQksYxsNk93WQwngzEePqpL7ZKf98r5g0nmlhSwInCndWJWe_Qn-on5FdBClquY1IM8Fa_pF-iLuG25Q28FgQtpRj2udbVs3om0b77gxkVfwjmo8BUdUOFF7MNXZ1CsdpQDal0wigKJMUkDXhxPlgNWhPn4MmHHW3C-3xRZvVmiqJJME_4J9IIBd9f8Fn5uAMskw4qu-JGCe_UfIJf2VUyPQ3";

const refresh = "AQAZAl9Wp7f-KzKqIbD8RD__9ceuNZ91v3Oj_bm_VJ5i4MXENRlGa4bJSWL-y3Lxng-cMJ0xpdNVMLG25VoHIpOBSs4JEWDXDUW57oirwSLy2dG9HfsgbM3cojRPqNhY1aQ";
spotify.getAccessTokenFromRefreshToken(refresh)
.then(accessToken => {
	console.log('access ' + accessToken);
	return accessToken;
})
.catch(error => {
	console.log(error);
});

/*
spotify.getTracksByIds([
    "7eqoqGkKwgOaWNNHx90uEZ",
    "1ID1QFSNNxi0hiZCNcwjUC",
    "4OciRObYGzPzlU40U7YRc8",
    "7ARveOiD31w2Nq0n5FsSf8",
    "6bGwKHXHNLmTy6yt147FPh"
  ])
.then(thing => {
	console.log(thing);
	return thing;
})
.catch(error => {
	console.log("ERROR " + error);
})

*/

/*
spotify.getAccessTokenFromCode(code).then(thing => {
	console.log(thing);
	return spotify.getSpotifyUser(thing);
})
.then(thing => {
	console.log(thing);
	return thing;
})
.catch(error => {
	console.log(error);
})
*/

/*
database.addPartyCodeToDatabase("brother").then(thing => {
	console.log(thing);
	return thing;
}).catch(error => {
	console.log(error);
})
*/

/*
for (let i = 0; i < 10; i++) {
	console.log(database.getRandomPartyId(6));
}
*/

/*
spotify.getSpotifyUserInfo("BQAFmLExjrMp6P_Jb6oYkhIoSFKvXEDsPnnMKwf-0tEQatK200ThOnekN9a5DPGj-mCHJGpagcgd5nJEcn7JmCijx9WFnij3cMdT_UFjdGcJ-roHC3mGT-PuhiHaszFrDjAivRZD-uaaga0OFxACJR6JrT-3l-6FPQ")
.then(thing => {
	console.log(thing);
	return thing;
}).catch(error => {
	console.log(error);
})
*/