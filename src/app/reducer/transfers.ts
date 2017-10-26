import {
    IAction,
    IStorable,
} from 'app/models/common'
import {ADD_TRANSFER_CHAIN} from 'app/constants'
import {
    IPayloadAddTransfer,
    ITransfer
} from 'app/models/transfers'

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

export default (state = defaultTransfers, action: IAction<any>) => {
    if (action && action.type && reducer[action.type]) {
        return reducer[action.type](state, action.payload)
    }
    return state
}

// Указанный тип у reducer - небольшой хак, чтобы обмануть typescript насчет нисходящего приведения типов.
// По-хорошему, ни здесь ни сверху в типе action не должно быть указано any.
// Однако в таком виде ts не ругается, и для каждого действия задана типизация payload, к чему и стремились.
const reducer: {[key: string]: any} = {
    [ADD_TRANSFER_CHAIN]: function(transferChains: IStorable<ITransfer>, payload: IPayloadAddTransfer): IStorable<ITransfer> {
        const {transfer} = payload
        return {...transferChains, [transfer.id]: transfer}
    }
}