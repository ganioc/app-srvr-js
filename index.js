const express=require('express')
const bodyParser=require('body-parser')
const _=require('lodash')



const app=express()

app.set('port', process.env.PORT || 3300)

app.use(bodyParser.urlencoded({extended: false}))
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

