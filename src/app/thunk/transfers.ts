import {
    ITrade,
    ITransfer
} from 'app/models/transfers'
import {
    IAction,
    IStore
} from 'app/models/common'
import * as transferActions from 'app/action/transfers'

type ADD_TRANSFER_CHAIN = (tripId: string, trades: ITrade[]) => (dispatch: Function, getState: () => IStore) => void
export function addTransferChain(tripId: string, trades: ITrade[]) {
    return (dispatch, getState: () => IStore) => {
        Promise.resolve('2').then((id: string) => {
            const transfer: ITransfer = {id, trades, date: new Date()}
            dispatch(transferActions.addTransferChain(tripId, transfer))
        })
    }
}

export interface ITransferThunks {
    addTransferChain: ADD_TRANSFER_CHAIN
}
