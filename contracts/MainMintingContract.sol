
pragma solidity ^0.7.0;

import {
    ISuperfluid,
    ISuperToken,
    ISuperApp,
    ISuperAgreement,
    SuperAppDefinitions
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {
    IConstantFlowAgreementV1
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

import {
    ISuperTokenFactory
}
from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperTokenFactory.sol";

import { INativeSuperToken, NativeSuperTokenProxy } from "@superfluid-finance/ethereum-contracts/contracts/tokens/NativeSuperToken.sol";
import "./Emitter.sol";

contract MainMintingContract {
    mapping (address=>bool) public _hasToken;
    mapping (address=>address) public _socialTokenMapping;
    INativeSuperToken public _socialToken;
    ISuperTokenFactory private _superTokenFactory;

    Emitter _emitter;
    event SocialTokenCreated(address owner,address tokenAddress,string name,string symbol,uint total_supply);
    constructor (
        ISuperfluid host,
        IConstantFlowAgreementV1 cfa,
        ISuperTokenFactory superTokenFactory,address emitterAdd) {
        _superTokenFactory = superTokenFactory;
        _emitter = Emitter(emitterAdd);
    }

    function mySuperSocialTokenAddress() external returns(address){
        return _socialTokenMapping[msg.sender];
    }

    function mintSuperSocialToken(string calldata name,string calldata symbol,uint256 TOTAL_SUPPLY) external returns(address) {
        // require(_hasToken[msg.sender],"You have already created a social token");//How to do this?
        _socialToken = INativeSuperToken(address(new NativeSuperTokenProxy()));
        _superTokenFactory.initializeCustomSuperToken(address(_socialToken));  
        uint256 _TOTAL_SUPPLY = 1000000000000000000000000;//TODO: Use supplied total supply
        _socialToken.initialize(
            name,
            symbol,
            _TOTAL_SUPPLY,
            msg.sender
        );

        _socialTokenMapping[msg.sender] = address(_socialToken);
        _hasToken[msg.sender] = true;
        _emitter.socialTokenCreated(msg.sender, address(_socialToken), name, symbol, TOTAL_SUPPLY);
        emit SocialTokenCreated(msg.sender, address(_socialToken), name, symbol, TOTAL_SUPPLY);
        return address(_socialToken);
    }
}