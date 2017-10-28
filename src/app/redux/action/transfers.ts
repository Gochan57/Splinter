import {
    ITrade,
    ITransfer
} from 'app/models/transfers'

export function addTransferChain (tripId: string, transfer: ITransfer): ITransferAction {
    return {
        type: 'ADD_TRANSFER_CHAIN',
        payload: {
            tripId,
            transfer
        }
    }
}

export type ITransferAction =
    {type: 'ADD_TRANSFER_CHAIN', payload: {tripId: string, transfer: ITransfer}} |
    {type: 'ASS', payload: {n: number}}