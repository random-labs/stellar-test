const request = require('request-promise-native');
const StellarSdk = require('stellar-sdk');

const { STELLAR_PUBLIC_KEY, STELLAR_PRIVATE_KEY } = require('../env');

class Stellar {
	constructor() {
		StellarSdk.Network.useTestNetwork();
		this.stellarSdkServer = new StellarSdk.Server('https://horizon-testnet.stellar.org');

		this.publicKey = STELLAR_PUBLIC_KEY;
		this.privateKey = STELLAR_PRIVATE_KEY;
		this.sourceKeys = null;

		if (this.publicKey !== null && this.privateKey !== null) {
			this.sourceKeys = StellarSdk.Keypair.fromSecret(this.privateKey);
		}

		this.accounts = {};
	}

	_generatePublicKey() {
		const pair = StellarSdk.Keypair.random();
		this.publicKey = pair.publicKey();
		this.secretKey = pair.secret();

		logger.info(`Please save those keys to keep the data: \npublicKey: ${this.publicKey}\nsecretKey: ${this.secretKey}`);
	}

	async createAccount() {
		logger.info('creating a new account...');
		if (!this.publicKey) {
			this._generatePublicKey();
		}

		const result = await request.get('https://friendbot.stellar.org', {
			method:                  'GET',
			qs:                      { addr: this.publicKey },
			json:                    true,
			resolveWithFullResponse: true,
		});
		if (result.statusCode !== 200) {
			throw result.body;
		} else {
			return this.loadAccount(this.publicKey);
		}
	}

	async loadAccount(key) {
		this.accounts[key] = await this.stellarSdkServer.loadAccount(key);
		logger.info(`Account "${key}" loaded!`);
		this.accounts[key].balances.forEach((balance) => {
			logger.info(`${balance.asset_type}: ${balance.balance}`);
		});
	}

	get me() {
		return this.publicKey;
	}

	send(destinationId, amount) {
		const transaction = new StellarSdk.TransactionBuilder(this.accounts[this.publicKey])
			.addOperation(StellarSdk.Operation.payment({
				destination: destinationId,
				asset:       StellarSdk.Asset.native(),
				amount,
			}))
			.build();

		const sourceKeys = StellarSdk.Keypair.fromSecret(this.privateKey);
		transaction.sign(sourceKeys);

		return this.stellarSdkServer.submitTransaction(transaction);
	}

	getTransations() {
		return request.get(`https://horizon-testnet.stellar.org/accounts/${this.publicKey}/transactions`, {
			method:                  'GET',
			json:                    true,
			resolveWithFullResponse: true,
		});
	}
}

module.exports = new Stellar();
