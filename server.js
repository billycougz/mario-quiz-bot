require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const { handler } = require('./src/index');

app.all('/', async (req, res) => {
	// Transform the Express request object into an AWS Lambda API Gateway event
	const event = {
		httpMethod: req.method,
		path: req.path,
		headers: req.headers,
		queryStringParameters: req.query,
		body: JSON.stringify(req.body),
		isBase64Encoded: false,
	};
	console.log(event);

	const { headers, body, statusCode } = await handler(event);
	res.set(headers);
	res.status(statusCode).json(JSON.parse(body));
});

const port = 8080;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
