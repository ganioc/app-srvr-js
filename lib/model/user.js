const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		dropDups: true,
		unique: true,
		index: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: Number,
		min: 0,
		max: 5,
		required: true,
	},
	usertype: {
		type: String,
		required: true,
		index: true
	},
	email: {
		type: String,
		dropDups: true,
		unique: true,
		index: true,
	},
	createdate: {
		type: Date,
		index: true,
	},
	phone: {
		type: String,
	},
	address: {
		type: String
	},
	extra: {
		type: String
	}
});

let UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;

