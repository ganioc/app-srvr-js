const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const mongoose = require('mongoose');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const authRouter = require('./lib/routes/auth')
const adminRouter = require('./lib/routes/admin')
const authJWT = require('./lib/routes/jwt')
const ErrCode = require('./lib/err')

const MAX_SESSION_TIME = 3600000



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

authRouter(router);
adminRouter(router);

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

app.listen(app.get('port'), '0.0.0.0', () => {
	console.log('Server up', app.get('port'));
});

