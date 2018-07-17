const StellarBase = require('stellar-base');
const request = require('supertest');
const server = require('../../index.js');

beforeAll(async () => {
	await server._init();
});

test('/receive 200', async () => {
	const response = await request(server.app.callback()).get('/receive');

	expect(response.status).toEqual(200);
	expect(StellarBase.StrKey.isValidEd25519PublicKey(response.body.address)).toBe(true);
});
