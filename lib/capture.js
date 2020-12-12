const http = require('http');
const p = require('puppeteer');

const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

const render = require('./render');

const captureFile = async (path, style) => await captureString(
	await readFile(path, 'utf-8'), (style || '')
);

const captureString = async (str, style) => {
	const path = 'test.png';
	const server = http.createServer(async (req, resp) => {
		const out = await render(
			str,
			(style || '')
		);
		resp.writeHead(200);
		resp.end(out);
	})
	server.listen(8080);

	const browser = await p.launch({args: ["--no-sandbox", "--disable-setuid-sandbox"]});
	const page = await browser.newPage();
	await page.goto('http://localhost:8080');
	await page.screenshot({ path, fullPage: true });
	browser.close();
	server.close();

	return path;
};

module.exports = {
	file: captureFile,
	string: captureString,
};
