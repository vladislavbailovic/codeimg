#!/usr/bin/env node

const cli = require('./lib/cli.js');

const main = async () => {
	await cli('code', 'Code to image (c2i)', 'Converts textual code to an image');
};
main();
