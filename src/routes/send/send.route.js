const { SevenBoom } = require('graphql-apollo-errors');
const { Route } = require('@guivic/fabric-node');
const Joi = require('joi');
const StellarBase = require('stellar-base');

const Stellar = require('../../utils/Stellar');

class Send extends Route {
	constructor() {
		super('/send', {
			create: {
				validation: {
					body: {
						address: Joi.string().required(),
						amount:  Joi.string().required(),
					},
				},
			},
		}, {
			json: true,
		});
	}

	async create(ctx) {
		const { address, amount } = ctx.request.body;

		if (!StellarBase.StrKey.isValidEd25519PublicKey(address)) {
			ctx.status = 400;
			ctx.body = SevenBoom.badRequest('Please check the address', {}, 'invalid-address');
			return;
		}

		let result = null;
		result = await Stellar.send(address, amount);
		ctx.body = result;
	}
}

module.exports = Send;
