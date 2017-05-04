import {UPDATE_NEW_PAYMENT, REMOVE_MEMBER_FROM_NEW_PAYMENT} from '../constants'
import {cloneDeep} from 'lodash'

const newPayment = {
    tripId: '1',
    members: {
        1: {
            spent: 100,
            paid: 200,
        },
        2: {
            spent: 150,
            paid: 0,
        },
        3: {
            spent: 300,
            paid: 200,
        },
    },
    paidOne: undefined,
}

const defaultPayments = {
    newPayment
}

export default (payments = defaultPayments, action) => {
    const {type, payload} = action

    switch(type) {
        case UPDATE_NEW_PAYMENT: {
            const {newPayment} = payload
            return {
                newPayment: {
                    ...payments.newPayment,
                    ...newPayment,
                }
            }
        }
        case REMOVE_MEMBER_FROM_NEW_PAYMENT: {
            const {id} = payload
            let _newPayment = cloneDeep(payments.newPayment)
            delete _newPayment.members[id]
            return {
                newPayment: _newPayment
            }
        }
    }

    return payments
}
