const http = require('http');
const qs = require('querystring');

module.exports = (template, render, port) => {
	const server = http.createServer(async (req, resp) => {
		let data = '';
		req.on('data', raw => data += raw);
		req.on('end', async () => {
			if (!data && req.method == "POST") return false;
			const post = qs.parse(data);
			const out = (await render(
				(post.style || ''),
				(post.font || ''),
				template
			))(post.code || '');
			resp.writeHead(200);
			resp.end(out);
		});
	})
	server.listen(port || 8080);
};


