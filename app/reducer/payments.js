import {START_CREATING_NEW_PAYMENT, UPDATE_PAYMENT, REMOVE_MEMBER_FROM_PAYMENT, CHANGE_MEMBER_SPENT_ON_PAYMENT} from '../constants'
import {cloneDeep, remove} from 'lodash'

const defaultPayments = {
    '1': {
        name: 'Супермаркет',
        date: '01.02.2017 17:01:24',
        members: [
            {personId: '1', spend: 100, pay: 0},
            {personId: '2', spend: 100, pay: 200},
        ],
        spentEqually: true,
        paidOne: true,
        sum: 200
    },
    '2': {
        name: 'Обучение у Сусы',
        date: '01.02.2017 10:34:12',
        members: [
            {personId: '1', spend: 50, pay: 0},
            {personId: '2', spend: 50, pay: 150},
            {personId: '3', spend: 50, pay: 0},
        ],
        spentEqually: true,
        paidOne: true,
        sum: 150
    },
    '3': {
        name: 'Такси',
        date: '02.02.2017 12:56:01',
        members: [
            {personId: '1', spend: 200, pay: 400},
            {personId: '3', spend: 200, pay: 0},
        ],
        spentEqually: true,
        paidOne: true,
        sum: 400
    },
}

const defaultNewPayment = {
    isNewPayment: true,
    members: [],
    spentEqually: false,
    paidOne: false,
    sum: 0
}

export default (payments = defaultPayments, action) => {
    console.log('payments action:', action)
    const {type, payload} = action

    switch(type) {
        case START_CREATING_NEW_PAYMENT: {
            const {paymentId, members} = payload
            return {
                ...payments,
                [paymentId]: {
                    ...defaultNewPayment,
                    members
                }
            }
        }
        case UPDATE_PAYMENT: {
            const {newPayment} = payload
            return {
                newPayment: {
                    ...payments.newPayment,
                    ...newPayment,
                }
            }
        }
        case REMOVE_MEMBER_FROM_PAYMENT: {
            const {paymentId, memberId} = payload
            let _newPayment = cloneDeep(payments[paymentId])
            remove(_newPayment.members, member => member.personId === memberId)
            return {
                newPayment: _newPayment
            }
        }
    }

    return payments
}
