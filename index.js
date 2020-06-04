const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const morgan = require('morgan')
const util = require('util')

const authRouter = require('./lib/routes/auth')
const adminRouter = require('./lib/routes/admin')
const userRouter = require('./lib/routes/user')
const authJWT = require('./lib/routes/jwt')
const ErrCode = require('./lib/err')
const logger = require('./lib/logger')

const MAX_SESSION_TIME = 3600000

let dbIp = 'localhost';
let dbPort = '27017';
let dbName = 'test';



////////////////////////////////////////////////
const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT || 'keepsafe';
const cfgObj = require('./config/config.json');
logger.info('config:')
logger.info(util.format('%o', cfgObj))

if (!cfgObj) {
	logger.error('No config.json');
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

logger.debug('mongodb uri:');
logger.debug(uri);

mongoose.connect(uri,
	{ useNewUrlParser: true })
	.catch(error => {
		logger.error('Connection error')
		logger.error(util.format('%o', error));
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

// use morgan
app.use(morgan('dev', {
	skip: function (req, res) {
		return res.statusCode < 400
	},
	stream: process.stderr
}))

app.use(morgan('dev', {
	skip: function (req, res) {
		return res.statusCode >= 400
	},
	stream: process.stdout
}))

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
userRouter(router);


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
	logger.debug('Server up');
	logger.debug(app.get('port'))
});

