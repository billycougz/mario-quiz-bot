const { handleGet, handlePost, handlePut } = require('./handlers');

exports.handler = async (event, context) => {
	//console.log('Received event:', JSON.stringify(event, null, 2));
	let body;
	let statusCode = '200';

	const corsHeaders = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': '*',
		'Access-Control-Allow-Methods': '*',
	};

	const headers = {
		'Content-Type': 'application/json',
		...corsHeaders,
	};

	try {
		switch (event.httpMethod) {
			case 'GET':
				body = await handleGet(event);
				break;
			case 'POST':
				body = await handlePost(event);
				break;
			case 'PUT':
				body = await handlePut(event);
				break;
			case 'OPTIONS':
				body = {};
				break;
			default:
				throw new Error(`Unsupported method "${event.httpMethod}"`);
		}
	} catch (err) {
		statusCode = '400';
		body = err.message;
	} finally {
		body = JSON.stringify(body);
	}

	return {
		statusCode,
		body,
		headers,
	};
};
