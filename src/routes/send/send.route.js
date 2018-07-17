const { Route } = require('@guivic/fabric-node');
const Joi = require('joi');

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

		const result = await Stellar.send(address, amount);

		ctx.body = result;
	}
}

module.exports = Send;
