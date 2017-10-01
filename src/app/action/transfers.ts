import {
    IPayloadAddTransfer,
    ITrade,
    ITransfer
} from 'app/models/transfers'
import {
    IAction,
    IStore
} from 'app/models/common'
import {ADD_TRANSFER_CHAIN} from 'app/constants'
import {dateToString} from '../utils/utils';

export function addTransferChain(tripId: string, trades: ITrade[]) {
    return (dispatch, getState: () => IStore) => {
        Promise.resolve('2').then((id: string) => {
            const transfer: ITransfer = {id, trades, date: new Date()}
            const action: IAction<IPayloadAddTransfer> = {
                type: ADD_TRANSFER_CHAIN,
                payload: {tripId, transfer}
            }
            dispatch(action)
        })
    }
}