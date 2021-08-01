import { BigInt } from "@graphprotocol/graph-ts"
import {
  Emitter,
  NFTMinted,
  NFTTransferred,
  SocialTokenCreated
} from "../generated/Emitter/Emitter"
import { NFT,SocialToken } from "../generated/schema"

export function handleNFTMinted(event: NFTMinted): void {
  let entity = new NFT(event.params.tokenId.toString());
  entity.creator = event.params.by
  entity.owner = event.params.to
  entity.uri = event.params.tokenURI
  entity.royalty = event.params.royalty
  entity.save()
}

export function handleNFTTransferred(event: NFTTransferred): void {
  let entity = NFT.load(event.params.tokenId.toString())
  entity.owner = event.params.newReceiver;
  entity.save()
}

export function handleSocialTokenCreated(event: SocialTokenCreated): void {
  let entity = new SocialToken(event.params.tokenAddress.toHexString());
  entity.address = event.params.tokenAddress
  entity.name=event.params.name
  entity.owner=event.params.owner
  entity.symbol=event.params.symbol
  entity.totalQuantity = event.params.total_supply
  entity.save()
}
