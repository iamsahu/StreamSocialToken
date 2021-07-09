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
    SuperAppBase
} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

contract ManageFlows is SuperAppBase{
    mapping (uint256=>IConstantFlowAgreementV1) _nftFlow;
    mapping (address=>ISuperToken) _flowToken;

    ISuperfluid internal _host; // host
    IConstantFlowAgreementV1 internal _cfa;
    
    constructor (ISuperfluid host,
        IConstantFlowAgreementV1 cfa) public {
        require(address(host) != address(0), "host is zero address");
        require(address(cfa) != address(0), "cfa is zero address");
        _host = host;
        _cfa = cfa;

        uint256 configWord =
            SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;

        _host.registerApp(configWord);
    }

    function CreateFlow(address _acceptedToken,address newReceiver,int96 flowRate) internal{
        ISuperToken _token = ISuperToken(_acceptedToken);
        _host.callAgreement(
            _cfa,
            abi.encodeWithSelector(
                _cfa.createFlow.selector,
                _token,
                newReceiver,
                flowRate,
                new bytes(0)
            ),
            "0x"
        );
    }

    function StopFlow(address _acceptedToken,address sender,address receiver) internal {
        ISuperToken _token = ISuperToken(_acceptedToken);
        _host.callAgreement(
            _cfa,
            abi.encodeWithSelector(
                _cfa.deleteFlow.selector,
                _token,
                sender,
                receiver,
                new bytes(0)
            ),
            "0x"
        );
    }

    function ChangeReceiver(uint256 tokenID,address to) internal{
        //Check if flow exists
        //If flow exists stop it and then start it to another
    }

    
    
}