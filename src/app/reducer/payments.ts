import {
    UPDATE_PAYMENT,
    CANCEL_UPDATING_PAYMENT,
    SET_CURRENT_PAYMENT,
} from '../constants'
import {
    IAction,
    IStorable
} from 'app/models/common'
import {
    IPayloadUpdatePayment,
    IStorePayment,
    IPayloadSetCurrentPayment,
} from 'app/models/payments'
import { handleActions } from 'redux-actions'
import * as _ from 'lodash'

const defaultPayments: IStorable<IStorePayment> = {
    '1': {
        id: '1',
        name: 'Супермаркет',
        date: new Date(2017, 2, 1, 17, 1, 24),
        members: [
            {personId: '1', spent: 100, paid: 0},
            {personId: '2', spent: 100, paid: 200, paidForAll: true},
        ],
        spentEqually: true,
        paidOne: true,
        sum: 200
    },
    '2': {
        id: '2',
        name: 'Обучение у Сусы',
        date: new Date(2017, 2, 1, 10, 34, 12),
        members: [
            {personId: '1', spent: 50, paid: 0},
            {personId: '2', spent: 50, paid: 150, paidForAll: true},
            {personId: '3', spent: 50, paid: 0},
        ],
        spentEqually: true,
        paidOne: true,
        sum: 150
    },
    '3': {
        id: '3',
        name: 'Такси',
        date: new Date(2017, 2, 2, 12, 56, 1),
        members: [
            {personId: '1', spent: 200, paid: 400, paidForAll: true},
            {personId: '3', spent: 200, paid: 0},
        ],
        spentEqually: true,
        paidOne: true,
        sum: 400
    }
}

export default (state = defaultPayments, action: IAction<any>) => {
    if (action && action.type && reducer[action.type]) {
        return reducer[action.type](state, action.payload)
    }
    return state
}

// Указанный тип у reducer - небольшой хак, чтобы обмануть typescript насчет нисходящего приведения типов.
// По-хорошему, ни здесь ни сверху в типе action не должно быть указано any.
// Однако в таком виде ts не ругается, и для каждого действия задана типизация payload, к чему и стремились.
const reducer: {[key: string]: any} = {
    [SET_CURRENT_PAYMENT]: function(payments: IStorable<IStorePayment>, payload: IPayloadSetCurrentPayment): IStorable<IStorePayment> {
        return {
            ...payments,

        }
    },
    [UPDATE_PAYMENT]: function(payments: IStorable<IStorePayment>, payload: IPayloadUpdatePayment): IStorable<IStorePayment> {
        const {payment} = payload
        return {
            ...payments,
            [payment.id]: payment
        }
    }
}
