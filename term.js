const prompts = require('prompts');
const DB = require('./lib/db');

const onCancel = prompt => {
	console.log('quit')
	process.exit(1)
}

const cfgObj = require('./config/config.json');
console.log('config:')
console.log(cfgObj);

let dbi = new DB(cfgObj);

(async () => {
	await new Promise((resolve, reject) => {
		console.log('To delay');
		setTimeout(() => {
			console.log('Delay over\n');
			resolve();
		}, 2000);
	});
	console.log('To prompts');
	while (true) {
		const response = await prompts({
			type: 'text',
			name: 'cmd',
			message: ''
			// validate: value => value< 18?'Nightclub is 18+ only': true
		},
			{ onCancel })

		console.log(response)
		await new Promise((resolve, reject) => {
			handleCmd(response.cmd, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			})
		}).catch(err => {
			console.log('ERR:', err);
		});
	}

})();

function handleCmd(cmds, cb) {
	let words = cmds.replace(/\s+/g, ' ').split(' ');

	if (words.length < 1) {
		return;
	}
	const cmd1 = words[0].toLowerCase();
	const args = words.splice(1, words.length - 1)

	console.log('cmd:', cmd1)
	console.log('args:', args)

	switch (cmd1) {
		case 'list':
			dbi.cmdList(args, cb);
			break;
		case 'add':
			dbi.cmdAdd(args, cb);
			break;
		case 'create':
			dbi.cmdCreateUserinfo(args, cb);
			break;
		case 'delete':
			dbi.cmdDelete(args, cb);
			break;
		case 'modify':
			dbi.cmdModify(args, cb);
			break;
		case 'q':
		case 'quit':
		case 'quit()':
			console.log('Bye\n');
			dbi.close();
			process.exit(0);
			break;
		default:
			console.log('Unknown cmds:', cmd1)
			cb(null);
			break;
	}
}