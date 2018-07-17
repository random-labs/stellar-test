const { MicroService } = require('@guivic/fabric-node');

const pkg = require('../package.json');
const { PORT, STELLAR_PUBLIC_KEY, STELLAR_PRIVATE_KEY } = require('./env');

const Receive = require('./routes/receive/receive.route');
const Send = require('./routes/send/send.route');
const Transactions = require('./routes/transactions/transactions.route');
const Stellar = require('./utils/Stellar');

(async function () {
	const app = new MicroService({
		port: PORT,
		async initMethod() {
			if (STELLAR_PUBLIC_KEY === null || STELLAR_PRIVATE_KEY === null) {
				await Stellar.createAccount();
			} else {
				await Stellar.loadAccount(Stellar.me);
			}
		},
	});

	app.addRoute(new Receive());
	app.addRoute(new Send());
	app.addRoute(new Transactions());

	await app.start();

	logger.info(`[${pkg.name}] listening on ${PORT}`);
}());
