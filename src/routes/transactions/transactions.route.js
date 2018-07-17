const { Route } = require('@guivic/fabric-node');
const Stellar = require('../../utils/Stellar');

class Transactions extends Route {
	constructor() {
		super('/transactions', {
			index: {},
		});
	}

	index(ctx) {
		ctx.body = Stellar.getTransations();
	}
}

module.exports = Transactions;
