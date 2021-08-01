var SimpleStorage = artifacts.require("./MainMintingContract.sol");
const SuperfluidSDK = require("@superfluid-finance/js-sdk");
const MainMintingContract = artifacts.require("MainMintingContract");
const SocialStreamableNFT = artifacts.require("SocialStreamableNFT");
const Emitter = artifacts.require("Emitter");

module.exports = async function (deployer, network) {
	if (network == "develop") {
		sf = new SuperfluidSDK.Framework({
			web3,
			version: "test",
			tokens: ["fDAI"],
		});
		await sf.initialize();
		let st = await sf.host.getSuperTokenFactory();
		await deployer.deploy(Emitter).then(async function () {
			await deployer.deploy(
				MainMintingContract,
				sf.host.address,
				sf.agreements.cfa.address,
				st,
				Emitter.address
			);
			await deployer.deploy(
				SocialStreamableNFT,
				sf.host.address,
				sf.agreements.cfa.address,
				Emitter.address
			);
		});
		return;
	}
	await deployer.deploy(Emitter).then(async function () {
		await deployer
			.deploy(
				MainMintingContract,
				"0xeD5B5b32110c3Ded02a07c8b8e97513FAfb883B6",
				"0xF4C5310E51F6079F601a5fb7120bC72a70b96e2A",
				"0xd465e36e607d493cd4CC1e83bea275712BECd5E0",
				Emitter.address
			)
			.then(async function () {
				await deployer.deploy(
					SocialStreamableNFT,
					"0xeD5B5b32110c3Ded02a07c8b8e97513FAfb883B6",
					"0xF4C5310E51F6079F601a5fb7120bC72a70b96e2A",
					Emitter.address
				);
			});
	});
};
