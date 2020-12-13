const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);

const stylesPath = './node_modules/highlight.js/styles';

const getAll = async () => ( await readDir(stylesPath) ).filter(style => style.match(/\.css$/i));

const getStyle = async sheet => {
	const allStyles = await getAll();
	sheet = sheet || allStyles[0];
	const stylesheet = allStyles.reverse().reduce((prev, s) => s == prev ? s : prev, sheet);
	return {
		name: stylesheet,
		value: await readFile(`${ stylesPath }/${ stylesheet }`, 'utf-8')
	};
};

const list = async () => console.log((await getAll()).join("\n"));

module.exports = {
	getAll,
	getStyle,
	list
};
