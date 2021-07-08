// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ManageFlows.sol";

//How do we add a flow before it is transferred to someone or the flow starts as soon as it is transferred to someone
contract SocialStreamableNFT is ManageFlows,ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor(ISuperfluid host,
        IConstantFlowAgreementV1 cfa) ERC721("SocialStreamableNFT", "SSSNFT") ManageFlows(host,cfa) {}

    function safeMint(address to,string memory tokenURI) public {
        _safeMint(to, _tokenIdCounter.current());
        _setTokenURI(_tokenIdCounter.current(), tokenURI);
        _tokenIdCounter.increment();
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    function createFlow(uint256 tokenId,address token,int96 flowRate) external{
        require(ownerOf(tokenId)!=msg.sender,"Flow could be created only after the NFT is bought by someone else");
        CreateFlow(token, ownerOf(tokenId), flowRate);
    }

    function _beforeTokenTransfer(
        address /*from*/,
        address to,
        uint256 /*tokenId*/
    ) internal override {
      
    }

}