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

export function addTransferChain(trades: ITrade[]) {
    return (dispatch, getState: () => IStore) => {
        Promise.resolve('2').then((id: string) => {
            const transfer: ITransfer = {id, trades, date: '01.04.2017 13:46'}
            const action: IAction<IPayloadAddTransfer> = {
                type: ADD_TRANSFER_CHAIN,
                payload: {transfer}
            }
            dispatch(action)
        })
    }
}