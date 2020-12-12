const capture = require('./lib/capture.js');
const preview = require('./lib/preview.js');
const styles = require('./lib/styles.js');
const output = require('./lib/output.js');

const main = async () => {
	const args = [...process.argv].slice(2);

	const subcommand = args.filter(
		arg => 'ls' === arg || 'serve' === arg
	);
	if (subcommand.length) {
		return 'ls' === subcommand[0]
			? styles.list()
			: preview();
	}

	const style = args.reduce(
		(prev, arg) => arg.match(/--style=/) ? arg.replace(/--style=/, '') : prev,
	'');
	const stdout = args.filter(arg => '--' === arg).length;
	const file = args.filter(arg => !arg.match(/^--/)).reduce(
		(prev, arg) => arg || prev,
	0 /* 0 means stdin */);

	const path = await capture.file(file, style);
	return stdout
		? output.clipboard(path)
		: output.file(path, file);
};
main();
