const http = require('http');
const p = require('puppeteer');

const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

const builder = require('./builder');

const captureFile = async (path, style) => await captureString(
	await readFile(path, 'utf-8'), (style || '')
);

const captureString = async (str, style) => {
	const server = http.createServer(async (req, resp) => {
		const out = await builder.buildPreview(
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
	await page.screenshot({ path: 'test.png', fullPage: true });
	browser.close();
	server.close();
};

const preview = () => {
	const server = http.createServer(async (req, resp) => {
		const qs = require('querystring');
		let data = '';
		req.on('data', raw => data += raw);
		req.on('end', async () => {
			if (!data && req.method == "POST") return false;
			const post = qs.parse(data);
			const out = await builder.buildPreview(
				(post.code || await readFile('./builder.js', 'utf-8')),
				(post.style || ''),
				'presenter'
			);
			resp.writeHead(200);
			resp.end(out);
		});
	})
	server.listen(8080);
};

const listStyles = async () => console.log(
	(await builder.getAvailableStyles())
		.filter(style => style.match(/\.css$/))
		.reduce((prev, style) => `${prev}${style}\n`, '')
);

const main = () => {
	const args = [...process.argv].slice(2);

	const subcommand = args.filter(
		arg => 'ls' === arg || 'serve' === arg
	);
	if (subcommand.length) {
		return 'ls' === subcommand[0]
			? listStyles()
			: preview();
	}

	const style = args.reduce(
		(prev, arg) => arg.match(/--style=/) ? arg.replace(/--style=/, '') : prev,
	'');
	const file = args.reduce(
		(prev, arg) => ! arg.match(/--style=/) ? arg.replace(/--style=/, '') : prev,
	0 /* 0 means stdin */);
	return captureFile(file, style);
};
main();
