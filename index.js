const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let UserModel = require('./lib/model/user.js');

let dbIp = 'localhost';
let dbPort = '27017';
let dbName = 'test';



////////////////////////////////////////////////
const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT || 'keepsafe';
const cfgObj = require('./config/config.json');
console.log('config:')
console.log(cfgObj);

if (!cfgObj) {
	console.log('No config.json');
	process.exit(1);
}

let header = cfgObj.mongo_user + ':'
	+ encodeURIComponent(cfgObj.mongo_passwd) + '@';
let uri = 'mongodb://'
	+ header
	+ dbIp
	+ ':'
	+ dbPort
	+ '/' + dbName;

console.log('uri:');
console.log(uri);
mongoose.connect(uri,
	{ useNewUrlParser: true })
	.catch(error => {
		console.log('Connection error')
		console.log(error);
		process.exit(1);
	});
/////////////////////////////////////////



const app = express();

app.set('port', process.env.PORT || 3300)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

////////////////////////////////////
const authJWT = (req, res, next) => {
	const token = req.headers['x-access-token'];
	if (!token) {
		res.status(401).json({ code: 1 });
		return;
	}
	jwt.verify(token, SECRET_KEY_JWT, (err, user) => {
		if (err) {
			return res.status(403).json({ code: 1 });
		}
		req.user = user;
		next();
	})
}

let router = new express.Router();
router.get('/api', authJWT, (req, res) => {
	let data = {
		name: 'api'
	};
	res.json({ code: 0, data });
});
router.get('/api/test', (req, res) => {
	let data = {
		name: 'Jason Krol',
		website: 'http://kroltech.com'
	};
	res.json({ code: 0, data });
});

router.post('/api/auth/login', (req, res) => {
	console.log('/api/auth/login:')
	// console.log(req);
	console.log(req.body);

	let user = req.body.name;

	let pass = req.body.pwd;

	UserModel.find({ username: user }, function (error, user) {
		if (error) {
			console.error('wrong auth');
			console.log(error);
			res.json({ code: 1, data: { message: 'FAIL' } });
		} else {
			console.log("user:");
			console.log(user);
			if(user.length == 0){
				return res.json({ code: 1, data: { message: 'FAIL' } });
			}

			console.log("pwd:");
			console.log(pass);

			bcrypt.compare(pass, user[0].password, function (err, doesMatch) {
				if (err) {
					console.error('wrong password');
					console.log(err);
					res.json({ code: 1, data: { message: 'FAIL' } });
				} else if (doesMatch === true) {
					console.log('password match');
					let user0 = user[0];
					let usertoken = jwt.sign({ username: user0.username, role: user0.role }, SECRET_KEY_JWT, { expiresIn: '1h' }
					);
					// console.log('usertoken:');
					// console.log(usertoken);
					let resObj = {
						code: 0,
						data: {
							// I will have name in the interface
							// username in the database. Be careful!!
							name: user0.username,
							email: user0.email,
							role: user0.role,
							token: usertoken
						}
					};
					console.log(resObj);
	
					return res.json(resObj);
				} else {
					console.log('password not match');
					res.json({ code: 1, data: { message: 'FAIL' } });
				}
			});
		}
	});
});

app.use('/', router);

app.use('*', (req, res) => {

	res.json({
		code: 1,
		data: {
			name: null,
			url: req.url
		}
	});
})

//app.get('/', (req, res)=>{
//	res.send('Hello World');
//});

app.listen(app.get('port'), '0.0.0.0', () => {
	console.log('Server up', app.get('port'));
});

