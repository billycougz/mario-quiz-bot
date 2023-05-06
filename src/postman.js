const request = require('postman-request');

// https://www.npmjs.com/package/postman-request
function postRequest({ url, oauth, body, json }) {
	return new Promise((resolve, reject) => {
		request.post({ url, oauth, body, json }, (error, response, body) => {
			resolve({ error, response, body });
		});
	});
}

module.exports = {
	postRequest,
};
