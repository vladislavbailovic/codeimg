gFonts = [
	"default",
	"Anonymous Pro",
	"B612 Mono",
	"Courier Prime",
	"Cousine",
	"Cutive Mono",
	"DM Mono",
	"Fira Code",
	"Fira Mono",
	"IBM Plex Mono",
	"Inconsolata",
	"JetBrains Mono",
	"Major Mono Display",
	"Nanum Gothic Coding",
	"Nova Mono",
	"Overpass Mono",
	"Oxygen Mono",
	"PT Mono",
	"Roboto Mono",
	"Share Tech Mono",
	"Source Code Pro",
	"Space Mono",
	"Syne Mono",
	"Ubuntu Mono",
	"VT323",
	"Xanh Mono",
];

const getAll = () => gFonts;

const getFont = font => {
	const allFonts = getAll();
	font = font || allFonts[0];
	return allFonts.reverse().reduce((prev, s) => s === prev ? s : prev, font);
};

const list = async () => console.log(getAll().join("\n"));

module.exports = { getAll, getFont, list };
