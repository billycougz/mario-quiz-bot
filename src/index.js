const { handleNewQuiz, handleQuizResults } = require('./handlers');

exports.handler = async (event, context) => {
	// console.log('Received event:', JSON.stringify(event, null, 2));
	const isFunctionUrl = Boolean(event.requestContext?.http);
	if (isFunctionUrl && process.env.STAGE && process.env.STAGE !== 'PROD') {
		const eventName = event.queryStringParameters?.eventName;
		let body = {};
		switch (eventName) {
			case 'newQuiz':
				body = await handleNewQuiz(event);
				break;
			case 'quizResults':
				body = await handleQuizResults(event);
				break;
			default:
				console.error('URL events require an eventName query param.');
		}
		return {
			statusCode: 200,
			body: JSON.stringify(body),
		};
	}
	const isScheduled = event['detail-type'] === 'Scheduled Event';
	if (isScheduled) {
		const { eventName } = event.detail;
		switch (eventName) {
			case 'newQuiz':
				await handleNewQuiz(event);
				break;
			case 'quizResults':
				await handleQuizResults(event);
				break;
			default:
				console.error('Scheduled events require an eventName.');
		}
		return;
	}
	console.error(`Event type did not match any condition.`);
};
