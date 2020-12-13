const hljs = require('highlight.js');
const fs = require('fs');

const styles = require('./styles.js');
const fonts = require('./fonts.js');

const templatesPath = './tpl';

const code = async (style, font, template) => {
	const tpl = fs.readFileSync(`${ templatesPath }/${ template || 'snippet' }.html`, 'utf-8');
	const stylesheet = await styles.getStyle(style);
	const allStyles = await styles.getAll();

	const fontName = fonts.getFont(font);
	const allFonts = fonts.getAll();

	return (str) => {
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
};

const markdown = async (style, font, template) => {
};

module.exports = { code, markdown };
