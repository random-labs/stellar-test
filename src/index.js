const { MicroService } = require('@guivic/fabric-node');

const pkg = require('../package.json');
const {
	PORT, NODE_ENV, STELLAR_PUBLIC_KEY, STELLAR_PRIVATE_KEY,
} = require('./env');

const Receive = require('./routes/receive/receive.route');
const Send = require('./routes/send/send.route');
const Transactions = require('./routes/transactions/transactions.route');
const Stellar = require('./utils/Stellar');

const server = new MicroService({
	port: PORT,
	async initMethod() {
		if (STELLAR_PUBLIC_KEY === null || STELLAR_PRIVATE_KEY === null) {
			await Stellar.createAccount();
		} else {
			await Stellar.loadAccount(Stellar.me);
		}
	},
});

server.addRoute(new Receive());
server.addRoute(new Send());
server.addRoute(new Transactions());

if (NODE_ENV === 'test') {
	module.exports = server;
} else {
	server
		.start()
		.then(() => {
			logger.info(`[${pkg.name}] listening on ${PORT}`);
		});
}

