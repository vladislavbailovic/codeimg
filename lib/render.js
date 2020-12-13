const hljs = require('highlight.js');
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

const styles = require('./styles.js');
const fonts = require('./fonts.js');

const templatesPath = './tpl';

module.exports = async (str, style, font, template) => {
	const tpl = await readFile(`${ templatesPath }/${ template || 'snippet' }.html`, 'utf-8');
	const stylesheet = await styles.getStyle(style);
	const allStyles = await styles.getAll();

	const fontName = fonts.getFont(font);
	const allFonts = fonts.getAll();

	const code = hljs.highlightAuto(str);
	const codeBlock = `<pre><code class="${ code.language }">${ code.value }</code></pre>`;

	return tpl
		.replace(/\{\{ALL_STYLES\}\}/g, allStyles.map(s => `'${ s }'`))
		.replace(/\{\{STYLE_NAME\}\}/g, stylesheet.name)
		.replace(/\{\{STYLE\}\}/g, stylesheet.value)

		.replace(/\{\{ALL_FONTS\}\}/g, allFonts.map(s => `'${ s }'`))
		.replace(/\{\{FONT_NAME\}\}/g, fontName)
		.replace(/\{\{FONT\}\}/g, fontName.replace(/ /, '+'))

		.replace(/\{\{LANGUAGE\}\}/g, code.language)
		.replace(/\{\{CODE\}\}/g, codeBlock)
		.replace(/\{\{RAWCODE\}\}/g, str)
	;
};
