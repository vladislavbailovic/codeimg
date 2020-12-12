const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

const clipboard = async path => {
	const img = await readFile(path);
	const { exec } = require('child_process');
	exec(`xclip -sel c -t image/png -i ${path}`, { timeout: 1000 }, err => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		fs.unlinkSync(path);
	});
};

module.exports = { clipboard };
