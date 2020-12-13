const http = require('http');
const qs = require('querystring');

const render = require('./render.js');

module.exports = port => {
	const server = http.createServer(async (req, resp) => {
		let data = '';
		req.on('data', raw => data += raw);
		req.on('end', async () => {
			if (!data && req.method == "POST") return false;
			const post = qs.parse(data);
			const out = await render(
				(post.code || ''),
				(post.style || ''),
				(post.font || ''),
				'preview'
			);
			resp.writeHead(200);
			resp.end(out);
		});
	})
	server.listen(port || 8080);
};


