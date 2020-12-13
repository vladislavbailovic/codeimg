#!/usr/bin/env node

const cli = require('./lib/cli.js');

const main = async () => {
	await cli('markdown', 'Markdown to image (m2i)', 'Converts markdown to HTML, to an image');
};
main();
