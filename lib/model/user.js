const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		dropDups: true
	},
	email: {
		type: String,
		dropDups: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: Number,
		min: 0,
		max: 2,
		required: true,
	}
});

let UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;

