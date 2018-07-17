const { Route } = require('@guivic/fabric-node');

const Stellar = require('../../utils/Stellar');

class Receive extends Route {
	constructor() {
		super('/receive', {
			index: {},
		});
	}

	index(ctx) {
		ctx.body = {
			address: Stellar.me,
		};
	}
}

module.exports = Receive;
