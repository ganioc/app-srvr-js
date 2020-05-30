const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const svgCaptcha = require('svg-captcha')

let UserModel = require('./lib/model/user.js');

const MAX_SESSION_TIME = 3600000

const ErrCode = {
	NO_ERR: 0,
	AUTH_NO_TOKEN: 10001,
	AUTH_FAIL: 10002,
	AUTH_ERROR: 10003,
	AUTH_INVALID_TOKEN: 10004,
	AUTH_INVALID_NAME: 10005,
	AUTH_INVALID_CAPTCHA: 10006,

};

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

// use MongoStore session
app.use(session({
	secret: cfgObj.sessionSecret,
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	maxAge: MAX_SESSION_TIME
}));

////////////////////////////////////
const authJWT = (req, res, next) => {
	const token = req.headers['x-access-token'];
	if (!token) {
		console.log('authJWT no x-access-token');
		return res.status(401).json({ code: ErrCode.AUTH_NO_TOKEN });
	} else {
		console.log('authJWT pass')
	}
	jwt.verify(token, SECRET_KEY_JWT, (err, user) => {
		if (err) {
			console.log('authJWT fail x-access-token');
			return res.status(403).json({ code: ErrCode.AUTH_INVALID_TOKEN });
		}
		req.user = user;
		next();
	})
}

let router = new express.Router();
router.get('/api/test', (req, res) => {
	let data = {
		name: 'Jason Krol',
		website: 'http://kroltech.com'
	};
	res.json({ code: 0, data });
});

router.get('/api', authJWT, (req, res) => {
	let data = {
		name: 'api'
	};
	res.json({ code: ErrCode.NO_ERR, data });
});


router.get('/api/auth/info', authJWT, (req, res) => {
	console.log('/api/auth/info:');
	console.log(req.session.username, req.session.role);

	res.json({
		code: 0, data: {
			name: req.session.username,
			role: req.session.role
		}
	})
});

router.get('/api/auth/captcha', (req, res) => {
	console.log('/api/auth/captcha');
	let captcha = svgCaptcha.create({ noise: 2, ignoreChars: '0o1i', size: 5 });
	req.session.captcha = captcha.text.toLowerCase();
	console.log('text:', captcha.text);

	res.json({ code: 0, data: { captcha: captcha.data } });
})

router.post('/api/auth/login', (req, res) => {
	console.log('/api/auth/login:')
	// console.log(req);
	console.log(req.body);

	let captcha_text = req.body.captcha;

	if (req.session.captcha !== captcha_text.toLowerCase()) {
		console.error('wrong captcha');
		res.json({ code: ErrCode.AUTH_INVALID_CAPTCHA, data: { message: 'FAIL' } });
		return;
	}

	let user = req.body.username;

	let pass = req.body.password;

	UserModel.find({ username: user }, function (error, user) {
		if (error) {
			console.error('wrong auth');
			console.log(error);
			res.json({ code: ErrCode.AUTH_ERROR, data: { message: 'FAIL' } });
		} else {
			console.log("user:");
			console.log(user);
			if (user.length == 0) {
				return res.json({ code: ErrCode.AUTH_FAIL, data: { message: 'FAIL' } });
			}

			console.log("pwd:");
			console.log(pass);

			bcrypt.compare(pass, user[0].password, function (err, doesMatch) {
				if (err) {
					console.error('wrong password');
					console.log(err);
					res.json({ code: ErrCode.AUTH_FAIL, data: { message: 'FAIL' } });
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
							username: user0.username,
							email: user0.email,
							role: user0.role,
							token: usertoken
						}
					};
					console.log(resObj);
					req.session.username = user0.username;
					req.session.role = user0.role;
					req.session.token = usertoken;

					return res.json(resObj);
				} else {
					console.log('password not match');
					res.json({ code: ErrCode.AUTH_FAIL, data: { message: 'FAIL' } });
				}
			});
		}
	});
});


router.post('/api/auth/logout', (req, res) => {
	console.log('/api/auth/logout:')
	req.session.destroy();
	res.json({
		code: 0,
		data: {}
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

