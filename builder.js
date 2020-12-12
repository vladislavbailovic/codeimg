const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);

const hljs = require('highlight.js');

const stylesPath = './node_modules/highlight.js/styles';
const templatesPath = './tpl';

const getAvailableStyles = () => readDir(stylesPath);

const getStyle = async sheet => {
	const allStyles = await getAvailableStyles();
	sheet = sheet || allStyles[0];
	const stylesheet = allStyles.reverse().reduce((prev, s) => s == prev ? s : prev, sheet);
	return {
		name: stylesheet,
		value: await readFile(`${ stylesPath }/${ stylesheet }`, 'utf-8')
	};
};

const buildPreview = async (str, style, template) => {
	const tpl = await readFile(`${ templatesPath }/${ template || 'snippet' }.html`, 'utf-8');
	const stylesheet = await getStyle(style);
	const allStyles = await getAvailableStyles();

	const code = hljs.highlightAuto(str);
	const codeBlock = `<pre><code class="${ code.language }">${ code.value }</code></pre>`;

	return tpl
		.replace(/\{\{ALL_STYLES\}\}/g, allStyles.map(s => `'${ s }'`))
		.replace(/\{\{STYLE_NAME\}\}/g, stylesheet.name)
		.replace(/\{\{STYLE\}\}/g, stylesheet.value)
		.replace(/\{\{LANGUAGE\}\}/g, code.language)
		.replace(/\{\{CODE\}\}/g, codeBlock)
		.replace(/\{\{RAWCODE\}\}/g, str)
	;
};

module.exports = {
	buildPreview,
	getStyle,
	getAvailableStyles,
};
