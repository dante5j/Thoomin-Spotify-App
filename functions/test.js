const spotify = require("./spotify");

spotify.loginCallbackUser("AQAudNTH2JhPGCaxmhKdEOhi9fZ17y_wfdBjhy8f266nS1CFA8MzM4pYlRRla1BNgyEJKEj-_4WRLGX4xQuFgO_tayLF1vmigNGcPHvx3rD0Zur9C1NIheKCYRxZj1iGDTgL5QeTCJOFwfEAoQAVj0NZKoavmjD4_-mhw2lXkzdMbMiybDXfTC97yQ9LQUMI9HrWam_5pPWZGRzNs_1_hAX8R6cqUYtNRwmdgZXIfTqHw2ej2Tvh_RauoazLZTtivUARwgES")
.then(body => {
	console.log(body);
	return;
}).catch(error => {
	console.log(error.message);
})