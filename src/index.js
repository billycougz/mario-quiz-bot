const { handleNewQuiz, handleQuizResults } = require('./handlers');

exports.handler = async (event, context) => {
	console.log('Lambda Event', event);
	switch (event.detail?.eventName) {
		case 'newQuiz':
			await handleNewQuiz(event);
			break;
		case 'quizResults':
			await handleQuizResults(event);
			break;
		default:
			const errorReason = event.detail?.eventName ? 'invalid' : 'empty';
			console.error(`The eventName is ${errorReason}.`);
	}
};
