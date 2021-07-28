const path = require("path");

module.exports = {
	// See <http://truffleframework.com/docs/advanced/configuration>
	// to customize your Truffle configuration!
	contracts_build_directory: path.join(__dirname, "client/src/contracts"),
	networks: {
		develop: {
			host: "localhost",
			network_id: "5777",
			port: 7545,
		},
		rinkeby: {
			provider: () =>
				new HDWalletProvider(process.env.WALLET_KEY, process.env.INFURA),
			network_id: 4, // Rinkeby's id
			gas: 5500000, // Rinkeby has a lower block limit than mainnet
			confirmations: 2, // # of confs to wait between deployments. (default: 0)
			timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
			networkCheckTimeout: 50000,
		},
	},
	compilers: {
		solc: {
			version: "0.7.6",
		},
	},
};
