
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


contract MainMintingContract {

    
    
    mapping (address=>address) _socialTokenMapping;
    INativeSuperToken public _socialToken;
    ISuperTokenFactory private _superTokenFactory;

    // Events

    
    event SocialTokenCreated(address owner,address tokenAddress,string name,string symbol,uint total_supply);
    
    constructor (
        ISuperfluid host,
        IConstantFlowAgreementV1 cfa,
        ISuperTokenFactory superTokenFactory) {
        _superTokenFactory = superTokenFactory;
    }

    function mintSuperSocialToken(string calldata name,string calldata symbol,uint TOTAL_SUPPLY) external returns(address) {
        // require(_socialTokenMapping[msg.sender],"You have already created a social token");
        _socialToken = INativeSuperToken(address(new NativeSuperTokenProxy()));
        _superTokenFactory.initializeCustomSuperToken(address(_socialToken));  
        
        _socialToken.initialize(
            name,
            symbol,
            TOTAL_SUPPLY
        );

        _socialTokenMapping[msg.sender] = address(_socialToken);
        emit SocialTokenCreated(msg.sender, address(_socialToken), name, symbol, TOTAL_SUPPLY);
        return address(_socialToken);
    }
}