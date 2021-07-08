var SimpleStorage = artifacts.require("./MainMintingContract.sol");
const SuperfluidSDK = require("@superfluid-finance/js-sdk");
const MainMintingContract = artifacts.require("MainMintingContract");
const SocialStreamableNFT = artifacts.require("SocialStreamableNFT");

module.exports = async function (deployer, network) {
	if (network == "develop") {
		sf = new SuperfluidSDK.Framework({
			web3,
			version: "test",
			tokens: ["fDAI"],
		});
		await sf.initialize();
		let st = await sf.host.getSuperTokenFactory();
		await deployer.deploy(
			MainMintingContract,
			sf.host.address,
			sf.agreements.cfa.address,
			st
		);
		await deployer.deploy(
			SocialStreamableNFT,
			sf.host.address,
			sf.agreements.cfa.address
		);
		// _mainMint = await MainMintingContract.new(
		// 	sf.host.address,
		// 	sf.agreements.cfa.address,
		// 	st
		// );

		return;
	}
	deployer.deploy(SimpleStorage);
};
