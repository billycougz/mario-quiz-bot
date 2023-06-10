const { generateQuiz } = require('./openai');
const { postTwitterPoll, postTwitterPollAnswer } = require('./twitter');
const { insertQuizRecord, getLastQuizRecord } = require('./dynamo');

async function handleNewQuiz() {
	const quizNumber = await getNewQuizNumber();
	if (!quizNumber) {
		return { error: 'Failed to create quizNumber.' };
	}
	const { marioQuizTerm, question, options, answer, error: openaiError } = await generateQuiz();
	if (openaiError) {
		return openaiError;
	}
	const { id: tweetId, error: twitterError } = await postTwitterPoll(quizNumber, question, options);
	if (twitterError) {
		return twitterError;
	}
	await insertQuizRecord({ quizNumber, marioQuizTerm, question, options, answer, tweetId });
	return { quizNumber, question, options, answer, tweetId };
}

async function handleQuizResults() {
	const { quizNumber, answer, createdAt } = await getLastQuizRecord();
	if (createdAt && isWithinLast12Hours(createdAt)) {
		// Ensures we only post if it's today's quiz (in case an error prevented a quiz)
		const { id, text, error } = await postTwitterPollAnswer(quizNumber, answer);
		return { id, text, error };
	}
	return { error: `Did not post quiz result due to invalid createdAt value: ${createdAt}.` };
}

function isWithinLast12Hours(timestamp) {
	const now = Date.now();
	const twelveHours = 12 * 60 * 60 * 1000;
	const diff = now - timestamp;
	return diff <= twelveHours;
}

async function getNewQuizNumber() {
	const { quizNumber, error } = await getLastQuizRecord();
	if (error) {
		return;
	}
	return (quizNumber || 0) + 1;
}

module.exports = {
	handleNewQuiz,
	handleQuizResults,
};
