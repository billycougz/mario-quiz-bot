const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const mockDocClient = {
	put: (params) => ({ promise: () => ({}) }),
	scan: (params) => ({ promise: () => ({ Items: [] }) }),
};

const STAGE = process.env.STAGE;

const docClient = STAGE === 'LOCAL' ? mockDocClient : new AWS.DynamoDB.DocumentClient();

const MARIO_QUIZ_TABLE = `MarioQuizTable-${STAGE}`;

async function insertQuizRecord({ quizNumber, question, options, answer, tweetId }) {
	try {
		const createdAt = Date.now();
		const partitionKey = 'quizRecord'; // Intentionally non-unique
		const params = {
			TableName: MARIO_QUIZ_TABLE,
			Item: { partitionKey, quizNumber, question, options, answer, tweetId, createdAt },
		};
		await docClient.put(params).promise();
		console.log(`Quiz record successfully inserted.`);
		return {};
	} catch (e) {
		console.error('An error was caught inside insertQuizRecord.', e);
		return { error: e };
	}
}

async function getLastQuizRecord() {
	try {
		const params = {
			TableName: MARIO_QUIZ_TABLE,
			KeyConditionExpression: '#pk = :pk',
			ExpressionAttributeNames: {
				'#pk': 'partitionKey',
			},
			ExpressionAttributeValues: {
				':pk': 'quizRecord',
			},
			ScanIndexForward: false, // sort in descending order
			Limit: 1,
		};
		const { Items } = await docClient.query(params).promise();
		return Items[0] || {}; // return the item or an empty object if there are no items
	} catch (e) {
		console.error('An error was caught inside getLastQuizRecord.', e);
		return { error: e };
	}
}

module.exports = {
	insertQuizRecord,
	getLastQuizRecord,
};
