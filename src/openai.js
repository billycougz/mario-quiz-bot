const { Configuration, OpenAIApi } = require('openai');

// https://www.npmjs.com/package/openai
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const prompt = `Create a challenging quiz about the Mario video game franchise from Nintendo.
The quiz should have a question, four options, and one of the options is the answer.
The quiz should be returned as a stringified JSON object.
The object should have the following structure: { question: string, options: string[], answer: string }
Here is an example: {"question":"What color is Mario's hat?","options":["red","yellow","green", "blue"],"answer":"red"}`;

// https://platform.openai.com/docs/api-reference/completions
async function generateQuiz() {
	try {
		const { data } = await openai.createCompletion({
			prompt,
			model: 'text-davinci-003',
			temperature: 1,
			max_tokens: 500,
		});
		const { text } = data.choices[0];
		const { question, options, answer } = JSON.parse(text);
		return { question, options, answer };
	} catch (e) {
		console.error('An error was caught inside generateQuiz.', e);
		return { error: e };
	}
}

module.exports = {
	generateQuiz,
};
