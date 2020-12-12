const { basename } = require('path');
const cliArgs = require('command-line-args');
const usage = require('command-line-usage');

const capture = require('./lib/capture.js');
const preview = require('./lib/preview.js');
const styles = require('./lib/styles.js');
const output = require('./lib/output.js');

const optionDefinitions = [
	{ name: 'file', description: 'File containing code', alias: 'f', type: String, defaultOption: true },
	{ name: 'style', description: 'Stylesheet to use', alias: 's', type: String },
	{ name: 'output', description: 'Output file - use dash for stdout, dot to just append png. Default is clipboard', alias: 'o', type: String },
	{ name: 'base64', description: 'Base64-encode stdout', alias: 'b', type: Boolean },
	{ name: 'help', description: 'Show this help', alias: 'h', type: Boolean },
];
const commandDefinitions = [
	{ name: 'command', description: 'Subcommand - one of help, ls or serve', defaultOption: true, typeLabel: '(optional)' },
];

const help = () => console.log(usage([
	{ header: 'Code to image (c2i)', content: 'Converts textual code to an image' },
	{ header: 'Subcommands', optionList: commandDefinitions },
	{ header: 'Options', optionList: optionDefinitions },
]));

const main = async () => {
	const subcommands = cliArgs(commandDefinitions, { stopAtFirstUnknown: true });
	const rawCommand = subcommands.command;
	const command = [ 'ls', 'search', 'help' ].reduce((prev, cmd) => rawCommand === cmd ? cmd : prev, 'capture')

	let file = 'capture' === command && !rawCommand
		? 0
		: rawCommand;

	if ('ls' === command) {
		return styles.list();
	}

	if ('serve' === command) {
		return preview();
	}

	if ('help' === command) {
		return help();
	}

	const argv = subcommands._unknown || []
	const options = cliArgs(optionDefinitions, { argv });
	if (options.help) {
		return help();
	}
	
	if (options.file) {
		file = options.file;
	}

	const path = await capture.file(file, options.style);
	if (!options.output) {
		return output.clipboard(path);
	}

	return options.output === "-"
		? output.stdout(path, options.base64)
		: output.file(path, options.output === "." ? basename(file) : options.output);
};
main();
