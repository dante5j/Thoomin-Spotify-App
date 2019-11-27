const spotify = require('./spotify');

const accessToken = 'BQCq-5eFWrbLBIfX5WPnvcebhMql5_ymeFhH8nXN9y6PPdSS72kGVi8rPCBbD4mGoO5VlO6kOHlVpJwSDJm1NmRJgwKJ42cdLeC_GiGM5oUTgJNmoqhLHlO0tjCwBEYs8Vsy1yb-TrwFxWs54XezLx52SMj90xHrpIMTh66ALUDsbC2GkBNv5MVLgUQClUEZMCzl2iE6E15do8Fq-_3kpFTkcxn-Pl_b';

spotify.createPlaylist(accessToken, 'Test Name')
.then(playlist => {
	console.log(playlist);
	return playlist;
})
.catch(error => {
	console.log(error);
})