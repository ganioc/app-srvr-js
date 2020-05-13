const prompts = require('prompts');

const onCancel = prompt => {
	console.log('quit')
	process.exit(1)
}

(async () => {
	while (true) {
		const response = await prompts({
			type: 'text',
			name: 'cmd',
			message: ''
			// validate: value => value< 18?'Nightclub is 18+ only': true
		},
			{ onCancel })

		console.log(response)
		handleCmd(response.cmd)
	}

})();

function handleCmd(cmds) {
	let words = cmds.replace(/\s+/g, ' ').split(' ');

	if (words.length < 1) {
		return;
	}
	const cmd1 = words[0].toLowerCase();
	const args = words.splice(1, words.length - 1)

	console.log('cmd:', cmd1)
	console.log('args:', args)

	switch (cmd1) {
		case 'q':
		case 'quit':
			console.log('Bye\n');
			process.exit(0);
			break;
		default:
			console.log('Unknown cmds:', cmd1)
			break;
	}
}