
let mongoose = require('mongoose')

console.log('Hello')


function main() {
	console.log('Do your work')

}

mongoose.connect('mongodb://myTester:testWont@123#org@localhost:27017/test',
	{ useNewUrlParser: true },
	function () {
		console.log('Connection been made')
		main();
	}).catch(err => {
		console.error('App starting error:', err.stack)
		process.exit(1)
	})

// let db = mongoose.connection;

