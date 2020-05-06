const express=require('express')
const bodyParser=require('body-parser')
const _=require('lodash')
const isValid = require('./lib/login').isValid


const app=express()

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

    if(isValid(user, pass)){
        res.json({login:'OK'});
    }else{
        res.json({login:'FAIL'});
    }
});

app.use('/', router);

app.use('*',(req, res)=>{

	res.json({name:null});
})

//app.get('/', (req, res)=>{
//	res.send('Hello World');
//});

app.listen(app.get('port'),'0.0.0.0', ()=>{
	console.log('Server up', app.get('port'));
});

