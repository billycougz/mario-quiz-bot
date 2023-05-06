const { postRequest } = require('./postman');

// https://developer.twitter.com/en/docs/authentication/oauth-1-0a
const oauth = {
	consumer_key: process.env.TWITTER_API_KEY,
	consumer_secret: process.env.TWITTER_API_SECRET,
	token: process.env.TWITTER_OAUTH1_TOKEN,
	token_secret: process.env.TWITTER_OAUTH1_TOKEN_SECRET,
};

// https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets
const tweetsEndpoint = 'https://api.twitter.com/2/tweets';

async function postTwitterPoll(quizNumber, question, options) {
	try {
		const tweetBody = {
			text: `Mario Quiz #${quizNumber}: ${question}`,
			poll: {
				options,
				duration_minutes: 480,
			},
		};
		const { body, error } = await postRequest({ url: tweetsEndpoint, oauth, body: tweetBody, json: true });
		if (error) {
			console.error('The postTwitterPoll request returned an error.', error);
			return { error };
		}
		const { id, text, edit_history_tweet_ids } = body.data;
		return { id, text, edit_history_tweet_ids };
	} catch (e) {
		console.error('An error was caught inside postTwitterPoll.', e);
		return { error: e };
	}
}

async function postTwitterPollAnswer(quizNumber, answer) {
	try {
		const tweetBody = { text: `The answer to Mario Quiz #${quizNumber} is ${answer}!` };
		const { body, error } = await postRequest({ url: tweetsEndpoint, oauth, body: tweetBody, json: true });
		if (error) {
			console.error('The postTwitterPollAnswer request returned an error.', error);
			return { error };
		}
		const { id, text, edit_history_tweet_ids } = body.data;
		return { id, text, edit_history_tweet_ids };
	} catch (e) {
		console.error('An error was caught inside postTwitterPollAnswer.', e);
		return { error: e };
	}
}

module.exports = {
	postTwitterPoll,
	postTwitterPollAnswer,
};
