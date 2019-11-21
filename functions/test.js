const spotify = require("./spotify");

spotify.loginCallbackUser("AQDhwNbBzBxX8X9l7FUFLWNL-rlG84dsCAYKeNpNsoaUS2G_Abgi6i4_Ji_mTaofNRwwhtgcH6mq8fILH1sOZN6-o43QqD0AktU6R6dX0UoGz1FyrIFASL7ZO15M3ls9B_JG8otuzTk-Gr_X31SjdixRnrRt_Mj4OUywQtvJbmR2RXQyoC9IjDERsmeVuIitvJ0GSDjP8Y_g06Z8kBiKF-H71q8h5uz8bRAc60jqSXHbGtkrRUaN-2m6YuFkb-VP1En4buZH")
.then(body => {
	console.log(body);
	return;
}).catch(error => {
	console.log(error.message);
})