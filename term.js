const prompts = require('prompts');

(async () => {
	const response = await prompts({
		type: 'text',
		name: 'cmd',
		message: '>'
		// validate: value => value< 18?'Nightclub is 18+ only': true
	},)

	console.log(response)

})();
