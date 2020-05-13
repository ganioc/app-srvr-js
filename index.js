const express=require('express');
const bodyParser=require('body-parser');
const _=require('lodash');
const isValid = require('./lib/login').isValid;
const bcrypt = require('bcrypt');
const mongoose= require('mongoose');
let UserModel = require('./model/user.js');

let dbIp = 'localhost';
let dbPort = '27017';
let dbName = 'test';


const app=express()
const cfgObj = require('./config/config.json');
console.log('config:')
console.log(cfgObj);

if(cfgObj){
	console.log('No config.json');
	process.exit(1);
}

let header = argObj.mongo_user + ':'
      + encodeURIComponent(argObj.mongo_passwd) + '@';
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


app.set('port', process.env.PORT || 3300)

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

let router= new express.Router();
router.get('/api', (req, res)=>{
	let data = {
		name:'api'
	};
	res.json(data);
});
router.get('/api/test', (req, res)=>{
	let data = {
		name: 'Jason Krol',
		website:'http://kroltech.com'
	};
	res.json(data);

});

router.post('/api/auth/login', (req,res)=>{
    // console.log('rx:');
    console.log('/api/auth/login:')
    // console.log(req);
    console.log(req.body);

    let user = req.body.name;

    let pass = req.body.pwd;

//    if(isValid(user, pass)){
//	       res.json({login:'OK'});
//    }else{
//        res.json({login:'FAIL'});
//    }
		UserModel.find({name:user}, function(error, user){
			if(error){
				console.error('wrong auth');
				console.log(error);
				res.json({login:'FAIL'});		
			}else{
				bcrypt.compare(pass, user.password, function(err, doesMatch){
					if(err){
						console.error('wrong password');
						console.log(err);
						res.json({login:'FAIL'});
					}else if(doesMatch === true){
						console.log('password match');
						res.json({login:'OK'});
					}else{
						console.log('password not match');
						res.json({login:'FAIL'});
					}
				}
			}
		}
});

app.use('/', router);

app.use('*',(req, res)=>{

	res.json({name:null,
			url:req.url});
})

//app.get('/', (req, res)=>{
//	res.send('Hello World');
//});

app.listen(app.get('port'),'0.0.0.0', ()=>{
	console.log('Server up', app.get('port'));
});

