const mongoose = require('mongoose');

const calenderSchema = mongoose.Schema({
	time: {
		type: String,

	},
	date: {
		type: String,

	},
	day: {
		type: String,

	},
});

const Calender = mongoose.model('Calender', calenderSchema);
module.exports = Calender;
