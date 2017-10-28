import {
    IAction,
    IStorable,
} from 'app/models/common'
import {
    ITransfer
} from 'app/models/transfers'
import {ITransferAction} from '../action/transfers';

const defaultTransfers: IStorable<ITransfer> = {
    '1': {
        id: '1',
        trades: [
            {
                id: '1',
                fromPerson: {
                    id: '1',
                    name: 'Гоша Чмутин'
                },
                toPerson: {
                    id: '2',
                    name: 'Юля Оглуздина'
                },
                count: 400
            },
            {
                id: '2',
                fromPerson: {
                    id: '2',
                    name: 'Юля'
                },
                toPerson: {
                    id: '3',
                    name: 'Саня'
                },
                count: 300
            },
            {
                id: '3',
                fromPerson: {
                    id: '2',
                    name: 'Юля'
                },
                toPerson: {
                    id: '3',
                    name: 'Саня'
                },
                count: 300
            },
            {
                id: '4',
                fromPerson: {
                    id: '2',
                    name: 'Юля'
                },
                toPerson: {
                    id: '3',
                    name: 'Саня'
                },
                count: 300
            },
            {
                id: '5',
                fromPerson: {
                    id: '2',
                    name: 'Юля'
                },
                toPerson: {
                    id: '3',
                    name: 'Саня'
                },
                count: 300
            },

        ],
        date: new Date(2017, 2, 10, 14, 55, 0)
    },
}

export default (transfers: IStorable<ITransfer> = defaultTransfers, action: ITransferAction): IStorable<ITransfer> => {
    if (!action) {
        return transfers
    }
    switch (action.type) {
        case 'ADD_TRANSFER_CHAIN': {
            const {transfer} = action.payload
            return {
                ...transfers,
                [transfer.id]: transfer
            }
        }
        default: {
            return transfers
        }
    }
}
