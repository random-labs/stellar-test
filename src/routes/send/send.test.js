const request = require('supertest');
const server = require('../../index.js');

beforeAll(async () => {
	await server._init();
});

test('/send 200', async () => {
	const response = await request(server.app.callback())
		.post('/send')
		.send({
			address: 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGSPIUKSLRB6Q723BM2OARMDUYEJ5',
			amount:  '10',
		});

	expect(response.status).toEqual(200);
	expect(response.body).toHaveProperty('hash');
});

test('/send 400 - invalid address', async () => {
	const response = await request(server.app.callback())
		.post('/send')
		.send({
			address: 'foobar',
			amount:  '10',
		});

	expect(response.status).toEqual(400);
	expect(response.body.output.payload.errorCode).toBe('invalid-address');
});

