const { web3tx, toWad, wad4human } = require("@decentral.ee/web3-helpers");

const deployFramework = require("@superfluid-finance/ethereum-contracts/scripts/deploy-framework");
const deployTestToken = require("@superfluid-finance/ethereum-contracts/scripts/deploy-test-token");
const deploySuperToken = require("@superfluid-finance/ethereum-contracts/scripts/deploy-super-token");
const SuperfluidSDK = require("@superfluid-finance/js-sdk");
const MainMintingContract = artifacts.require("MainMintingContract");
const SocialStreamableNFT = artifacts.require("SocialStreamableNFT");
const traveler = require("ganache-time-traveler");
const TEST_TRAVEL_TIME = 3600 * 2; // 1 hours

contract("MainMintingContract", async (accounts) => {
	const errorHandler = (err) => {
		if (err) throw err;
	};

	const names = ["Admin", "Alice", "Bob", "Carol", "Dan", "Emma", "Frank"];
	accounts = accounts.slice(0, names.length);

	let sf;
	let dai;
	let daix;
	let app;
	let _mainMint;
	let _nftContract;
	const u = {}; // object with all users
	const aliases = {};

	// before(async function () {
	// 	//process.env.RESET_SUPERFLUID_FRAMEWORK = 1;
	// 	await deployFramework(errorHandler, {
	// 		web3,
	// 		from: accounts[0],
	// 	});
	// });

	beforeEach(async function () {
		sf = new SuperfluidSDK.Framework({
			web3,
			version: "test",
			tokens: ["fDAI"],
		});
		await sf.initialize();
		daix = sf.tokens.fDAIx;
		// console.log("Address");
		// console.log(sf.host.address);
		// console.log("TokenFactory");
		// let st = await sf.host.getSuperTokenFactory();
		_mainMint = await MainMintingContract.deployed();
		_nftContract = await SocialStreamableNFT.deployed();
		// _mainMint = await MainMintingContract.new(
		// 	sf.host.address,
		// 	sf.agreements.cfa.address,
		// 	st
		// );
	});
	describe("Fuzzy testing", async function () {
		it("Case #6 - Random testing", async () => {
			try {
				let tp = await _mainMint.mintSuperSocialToken(
					"SocialStream",
					"SS",
					1000000000 //How to send a big number
				);
				// console.log(tp);
			} catch (error) {
				console.log("Error while minting: " + error.message);
			}

			let ssA = await _mainMint.mySuperSocialTokenAddress.call({
				from: accounts[0],
			});
			console.log("Social Token Address: " + ssA);
			// console.log(ssA);
			let NFT = await _nftContract.safeMint(accounts[1], "This is a test mint");
			// console.log(NFT.logs);
			// console.log(NFT.logs[0].args);

			let flowcr = await _nftContract.createFlow(0, ssA, "3858024691358");
			console.log(flowcr);
		});
	});
});
