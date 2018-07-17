module.exports = {
	NODE_ENV:            process.env.NODE_ENV || 'development',
	PORT:                process.env.PORT || 3000,
	STELLAR_PUBLIC_KEY:  process.env.STELLAR_PUBLIC_KEY || null,
	STELLAR_PRIVATE_KEY: process.env.STELLAR_PRIVATE_KEY || null,
};
