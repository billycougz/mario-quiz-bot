const { Configuration, OpenAIApi } = require('openai');
const { getMarioTerm } = require('./mario-terms');

// https://www.npmjs.com/package/openai
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function createPrompt(marioQuizTerm) {
	return `Create a challenging quiz about the Mario video game franchise from Nintendo.
	The quiz question must be involve ${marioQuizTerm} and it should be challenging (for instance, the answer should not be similar to the term in the question.)
	The quiz must have a question, four options, and one of the options must be the correct answer.
	The quiz must be returned as a stringified JSON object.
	The object must have the following structure: { question: string, options: string[], answer: string }
	Here is an example: {"question":"What color is Mario's hat?","options":["red","yellow","green","blue"],"answer":"red"}`;
}

// https://platform.openai.com/docs/api-reference/completions
async function generateQuiz() {
	try {
		const marioQuizTerm = getMarioTerm();
		const { data } = await openai.createCompletion({
			prompt: createPrompt(marioQuizTerm),
			model: 'text-davinci-003',
			temperature: 0.1,
			max_tokens: 500,
		});
		const { text } = data.choices[0];
		const { question, options, answer } = JSON.parse(text);
		console.log('Quiz Data', { marioQuizTerm, question, options, answer });
		return { marioQuizTerm, question, options, answer };
	} catch (e) {
		console.error('An error was caught inside generateQuiz.', e);
		return { error: e };
	}
}

module.exports = {
	generateQuiz,
};
