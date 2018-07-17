const request = require('supertest');
const server = require('../../index.js');

beforeAll(async () => {
	await server._init();
});

test('/transactions 200', async () => {
	const response = await request(server.app.callback())
		.get('/transactions');

	expect(response.status).toEqual(200);
	expect(response.body).toHaveProperty('_embedded.records');
});
