const http = require('http');
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

const render = require('./render.js');

module.exports = () => {
	const server = http.createServer(async (req, resp) => {
		const qs = require('querystring');
		let data = '';
		req.on('data', raw => data += raw);
		req.on('end', async () => {
			if (!data && req.method == "POST") return false;
			const post = qs.parse(data);
			const out = await render(
				(post.code || ''),
				(post.style || ''),
				'presenter'
			);
			resp.writeHead(200);
			resp.end(out);
		});
	})
	server.listen(8080);
};


