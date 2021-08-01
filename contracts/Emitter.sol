// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract Emitter{
    
    event NFTMinted(address by,address to,uint256 tokenId,string tokenURI,uint256 royalty);
    function minted(address by,address to,uint256 tokenId,string memory tokenURI,uint256 royalty) external{
        emit NFTMinted(by,to,tokenId,tokenURI,royalty);
    }

    event SocialTokenCreated(address owner,address tokenAddress,string name,string symbol,uint total_supply);
    function socialTokenCreated(address owner,address tokenAddress,string memory name,string memory symbol,uint total_supply) external{
        emit SocialTokenCreated(owner, tokenAddress, name, symbol, total_supply);
    }

    event NFTTransferred( address from,address newReceiver,uint256 tokenId);
    function nftTransferred( address from,address newReceiver,uint256 tokenId) external{
        emit NFTTransferred(from,newReceiver,tokenId);
    }
}