const http = require('http');
const p = require('puppeteer');
const fs = require('fs');

const captureFile = async (path, render, port) => await captureString(
	fs.readFileSync(path, 'utf-8'), render, port
);

const captureString = async (str, render, port) => {
	port = port || 8182;
	const path = `${ (new Date()).getTime() }.png`;
	const server = http.createServer((req, resp) => {
		const out = render(str);
		resp.writeHead(200);
		resp.end(out);
	})
	server.listen(port);

	const browser = await p.launch({args: ["--no-sandbox", "--disable-setuid-sandbox"]});
	const page = await browser.newPage();
	await page.goto(`http://localhost:${ port }`, { waitUntil: 'networkidle0' });
	await page.screenshot({ path, fullPage: true });
	browser.close();
	server.close();

	return path;
};

module.exports = {
	file: captureFile,
	string: captureString,
};
