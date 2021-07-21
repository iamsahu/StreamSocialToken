// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ManageFlows.sol";
import "./Emitter.sol";

//How do we add a flow before it is transferred to someone or the flow starts as soon as it is transferred to someone
contract SocialStreamableNFT is ManageFlows,ERC721, Ownable {
    using Counters for Counters.Counter;
    mapping (uint256=>address) _nftCreator;
    mapping (uint256=>address) _nftToken;

    Emitter _emitter;

    Counters.Counter private _tokenIdCounter;

    constructor(ISuperfluid host,
        IConstantFlowAgreementV1 cfa,address emitterAdd) ERC721("SocialStreamableNFT", "SSSNFT") ManageFlows(host,cfa) {
            _emitter=Emitter(emitterAdd);
        }

    function safeMint(address to,string memory tokenURI) public {
        _safeMint(to, _tokenIdCounter.current());
        _setTokenURI(_tokenIdCounter.current(), tokenURI);
        _nftCreator[_tokenIdCounter.current()] = msg.sender;
        _emitter.minted(msg.sender,to,_tokenIdCounter.current(),tokenURI);
        _tokenIdCounter.increment();
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    // function createFlow(uint256 tokenId,address token,int96 flowRate) external {
    //     require(ownerOf(tokenId)!=msg.sender,"Flow could be created only after the NFT is bought by someone else");
    //     CreateFlow(token, ownerOf(tokenId), flowRate);
    // }

    function stopFlow(uint256 tokenId,address token) external {
        require(_nftCreator[tokenId]==msg.sender,"Only the creator of the NFT could stop the flow ");
        StopFlow(token, msg.sender, ownerOf(tokenId));
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        
        if(from!=address(0)){//When it is minted the address is set to zero, we don't need to change receiver in this case
            _changeReceiver(from,to,tokenId);
        }
    }

    function _updateOutflow(bytes calldata ctx,ISuperToken _acceptedToken)
        private
        returns (bytes memory newCtx)
    {
      newCtx = ctx;
      //(std.itemsOrdered,std.units) = abi.decode(_host.decodeCtx(ctx).userData, (uint[3], uint[3]));
      uint256 tokId = abi.decode(_host.decodeCtx(ctx).userData, (uint256));//Solidity
      address _receiver = ownerOf(tokId);//TODO: How to make this generalized? Will have to decode the context data to get the tokenID
      _nftToken[tokId] = address(_acceptedToken);
      // @dev This will give me the new flowRate, as it is called in after callbacks
      int96 netFlowRate = _cfa.getNetFlow(_acceptedToken, address(this));
      (,int96 outFlowRate,,) = _cfa.getFlow(_acceptedToken, address(this), _receiver); // CHECK: unclear what happens if flow doesn't exist.
      int96 inFlowRate = netFlowRate + outFlowRate;

      // @dev If inFlowRate === 0, then delete existing flow.
      if (inFlowRate == int96(0)) {
        // @dev if inFlowRate is zero, delete outflow.
          (newCtx, ) = _host.callAgreementWithContext(
              _cfa,
              abi.encodeWithSelector(
                  _cfa.deleteFlow.selector,
                  _acceptedToken,
                  address(this),
                  _receiver,
                  new bytes(0) // placeholder
              ),
              "0x",
              newCtx
          );
        } else if (outFlowRate != int96(0)){
        (newCtx, ) = _host.callAgreementWithContext(
            _cfa,
            abi.encodeWithSelector(
                _cfa.updateFlow.selector,
                _acceptedToken,
                _receiver,
                inFlowRate,
                new bytes(0) // placeholder
            ),
            "0x",
            newCtx
        );
      } else {
      // @dev If there is no existing outflow, then create new flow to equal inflow
          (newCtx, ) = _host.callAgreementWithContext(
              _cfa,
              abi.encodeWithSelector(
                  _cfa.createFlow.selector,
                  _acceptedToken,
                  _receiver,
                  inFlowRate,
                  new bytes(0) // placeholder
              ),
              "0x",
              newCtx
          );
      }
    }

    // @dev Change the Receiver of the total flow
    function _changeReceiver( address from,
        address newReceiver,
        uint256 tokenId ) internal {
        require(newReceiver != address(0), "New receiver is zero address");
        // @dev because our app is registered as final, we can't take downstream apps
        require(!_host.isApp(ISuperApp(newReceiver)), "New receiver can not be a superApp");
        if (newReceiver == ownerOf(tokenId)) return ;
        // @dev delete flow to old receiver
        ISuperToken _acceptedToken = ISuperToken(_nftToken[tokenId]);
        (,int96 outFlowRate,,) = _cfa.getFlow(_acceptedToken, address(this), from); //CHECK: unclear what happens if flow doesn't exist.
        if(outFlowRate > 0){
          _host.callAgreement(
              _cfa,
              abi.encodeWithSelector(
                  _cfa.deleteFlow.selector,
                  _acceptedToken,
                  address(this),
                  from,
                  new bytes(0)
              ),
              "0x"
          );
          // @dev create flow to new receiver
          _host.callAgreement(
              _cfa,
              abi.encodeWithSelector(
                  _cfa.createFlow.selector,
                  _acceptedToken,
                  newReceiver,
                  _cfa.getNetFlow(_acceptedToken, address(this)),
                  new bytes(0)
              ),
              "0x"
          );
        }
        // @dev set global receiver to new receiver
        
        _emitter.nftTransferred(from,newReceiver,tokenId);
    }

    /**************************************************************************
     * Superapp Callbacks
     *************************************************************************/

    // function beforeAgreementCreated(
    //     ISuperToken superToken,
    //     address agreementClass,
    //     bytes32 agreementId,
    //     bytes calldata agreementData,
    //     bytes calldata ctx
    // )
    //     external
    //     view
    //     returns (bytes memory cbdata){

    // }
    
    function afterAgreementCreated(
        ISuperToken superToken,
        address agreementClass,
        bytes32 agreementId,
        bytes calldata agreementData,
        bytes calldata cbdata,
        bytes calldata ctx
    )
    external override
    returns (bytes memory newCtx){
        return _updateOutflow(ctx,superToken);
    }
    
    function afterAgreementUpdated(
        ISuperToken superToken,
        address agreementClass,
        bytes32 agreementId,
        bytes calldata agreementData,
        bytes calldata cbdata,
        bytes calldata ctx
    )
        external override
        returns (bytes memory newCtx){
            return _updateOutflow(ctx,superToken);
            // return newCtx;
        }
    
    function afterAgreementTerminated(
        ISuperToken superToken,
        address agreementClass,
        bytes32 agreementId,
        bytes calldata agreementData,
        bytes calldata cbdata,
        bytes calldata ctx
    )
        external override
        returns (bytes memory newCtx){
            newCtx=ctx;
            return newCtx;
        }
}
