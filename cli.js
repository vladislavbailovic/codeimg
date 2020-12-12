const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

const capture = require('./lib/capture.js');
const preview = require('./lib/preview.js');
const styles = require('./lib/styles.js');

const listStyles = async () => console.log(
	(await styles.getAll())
		.reduce((prev, style) => `${prev}${style}\n`, '')
);

const main = async () => {
	const args = [...process.argv].slice(2);

	const subcommand = args.filter(
		arg => 'ls' === arg || 'serve' === arg
	);
	if (subcommand.length) {
		return 'ls' === subcommand[0]
			? listStyles()
			: preview();
	}

	const style = args.reduce(
		(prev, arg) => arg.match(/--style=/) ? arg.replace(/--style=/, '') : prev,
	'');
	const stdout = args.filter(arg => '--' === arg).length;
	const file = args.filter(arg => arg !== '--').reduce(
		(prev, arg) => ! arg.match(/--style=/) ? arg.replace(/--style=/, '') : prev,
	0 /* 0 means stdin */);

	const path = await capture.file(file, style);
	if (stdout) {
		const img = await readFile(path);
		const { exec } = require('child_process');
		exec(`xclip -sel c -t image/png -i ${path}`, { timeout: 1000 }, err => {
			if (err) {
				console.error(err);
				process.exit(1);
			}
			fs.unlinkSync(path);
		});
	}
};
main();
