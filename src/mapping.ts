import { BigInt, log, Address } from "@graphprotocol/graph-ts"
import { Contract, Approval, Transfer } from "../generated/Contract/Contract"
import { AddLiquidity } from "../generated/Swap/Swap"
import { Swap } from "../generated/Swap/Swap"
import { TransferEvent as TransferEventEntity, VirtualPrice as VirtualPriceEntity, Transfer as TransferEntity } from "../generated/schema"

export function handleTransfer(event: Transfer): void {
  let eventid = event.block.hash.toHex() + '-' + event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let theevent = new TransferEntity(eventid)
  theevent.address = event.address
  theevent.logIndex = event.logIndex
  theevent.from = event.params.from
  theevent.to = event.params.to
  theevent.value = event.params.value
  theevent.save()

  let entity = TransferEventEntity.load(event.transaction.hash.toHex())
  if(!entity) {
    entity = new TransferEventEntity(event.transaction.hash.toHex())
    entity.block = event.block.number
    entity.timestamp = event.block.timestamp
    entity.transfers = [eventid]
  }
  else {
    let transfers = entity.transfers
    transfers.push(eventid)
    entity.transfers = transfers
  }

  entity.save()

  //handleBlock(event)
}

export function handleBlock(event: AddLiquidity): void {

  let blockNumber = event.block.number
  //if(blockNumber.mod(1000 as BigInt) == 0 as BigInt) {
    let swap = Swap.bind(event.address)
    let callData = swap.try_get_virtual_price()
    if(!callData.reverted) {
      let entity = new VirtualPriceEntity(event.transaction.hash.toHex())

      entity.address = event.address
      entity.block = event.block.number
      entity.timestamp = event.block.timestamp
      entity.virtualPrice = callData.value

      entity.save()
    }
  //}
}
