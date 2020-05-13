const mongoose =  require('mongoose');

const userSchema = new mongoose.Schema({
	username:{
		type: String,
		required: true,
	},
	email:{
		type: String,
	},
	password:{
		type:String,
	},
	role:{
		type: Number,
		min: 0,
		max: 2,
		required: true,
	}
});

let UserModel = mongoose.model('User', userSchema);

module.exports= UserModel;

