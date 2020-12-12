const path = require('path');
const fs = require('fs');

const getFilename = file => {
	if ("0" === `${ file }`) return "stdin.png";
	return `${ path.dirname(file) || process.cwd() }/${ path.basename(file).replace(/\.png$/, '') }.png`;
};

const clipboard = async path => {
	const img = fs.readFileSync(path);
	const { exec } = require('child_process');
	exec(`xclip -sel c -t image/png -i ${path}`, { timeout: 1000 }, err => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		fs.unlinkSync(path);
	});
};

const file = (path, filename) => {
	fs.rename(path, getFilename(filename), err => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
	});
};

const stdout = (path, encode) => {
	const encoding = encode ? 'base64' : 'binary';
	process.stdout.write(fs.readFileSync(path, encoding));
	fs.unlinkSync(path);
};

module.exports = { clipboard, file, getFilename, stdout };
