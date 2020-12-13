const { basename } = require('path');
const cliArgs = require('command-line-args');
const usage = require('command-line-usage');

const capture = require('./capture.js');
const preview = require('./preview.js');
const styles = require('./styles.js');
const fonts = require('./fonts.js');
const output = require('./output.js');
const render = require('./render.js');

const optionDefinitions = [
	{ name: 'port', description: 'Port used to serve rendered markup - default 8080', alias: 'p', type: Number },
	{ name: 'input', description: 'Input file containing code', alias: 'i', type: String, defaultOption: true },
	{ name: 'style', description: 'Stylesheet to use', alias: 's', type: String },
	{ name: 'font', description: 'Font to use', alias: 'f', type: String },
	{ name: 'output', description: 'Output file - use dash for stdout, dot to just append png. Default is clipboard', alias: 'o', type: String },
	{ name: 'base64', description: 'Base64-encode stdout', alias: 'b', type: Boolean },
	{ name: 'help', description: 'Show this help', alias: 'h', type: Boolean },
];
const commandDefinitions = [
	{ name: 'command', description: 'Subcommand - one of help, ls, lf or serve', defaultOption: true, typeLabel: '(optional)' },
];

const help = (name, description) => console.log(usage([
	{ header: name, content:  description},
	{ header: 'Subcommands', optionList: commandDefinitions },
	{ header: 'Options', optionList: optionDefinitions },
]));

module.exports = async (type, name, description) => {
	const subcommands = cliArgs(commandDefinitions, { stopAtFirstUnknown: true });
	const rawCommand = subcommands.command;
	const command = [ 'ls', 'lf', 'serve', 'help' ].reduce((prev, cmd) => rawCommand === cmd ? cmd : prev, 'capture')

	let file = 'capture' === command && !rawCommand
		? 0
		: rawCommand;

	if ('ls' === command) {
		return styles.list();
	}

	if ('lf' === command) {
		return fonts.list();
	}

	if ('help' === command) {
		return help(name, description);
	}

	const argv = subcommands._unknown || []
	const options = cliArgs(optionDefinitions, { argv });
	if (options.help) {
		return help();
	}

	if ('serve' === command) {
		return preview(`${ type }-preview`, render[type], options.port);
	}

	if (options.input) {
		file = options.input;
	}

	const path = await capture.file(
		file,
		(await render[type](options.style, options.font)),
		options.port
	);
	if (!options.output) {
		return output.clipboard(path);
	}

	return options.output === "-"
		? output.stdout(path, options.base64)
		: output.file(path, options.output === "." ? basename(file) : options.output);
};
