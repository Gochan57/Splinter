import {
    START_UPDATING_PAYMENT,
    SPENT_EQUALLY_SWITCHED,
    PAID_ONE_SWITCHED,
    REMOVE_MEMBER_FROM_PAYMENT,
    CHANGE_MEMBER_SPENT_ON_PAYMENT,
    UPDATE_PAYMENT,
    CANCEL_UPDATING_PAYMENT,
    TEMPORARY_ID} from '../constants'
import {cloneDeep, find, remove, omit} from 'lodash'

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
    }
}

const defaultNewPayment = {
    paymentId: undefined,
    members: [],
    spentEqually: false,
    paidOne: false,
    sum: 0
}

export default (payments = defaultPayments, action) => {
    const {type, payload} = action

    switch(type) {
        case START_UPDATING_PAYMENT: {
            // Создадим в payments поле с ключом -1, куда скопируем редактируемый счет,
            // или, в случае создания нового счета,  defaultNewPayment.
            // При редактировании счета будем менять именно этот счет, а затем,
            // по нажатию "Сохранить", скопируем новые значения в поля оригинального счета.

            // paymentId передается в случае редактирования существующего счета.
            // members передается в случае создания нового счета (по умолчанию это все участники путешествия).
            const {paymentId, members} = payload

            let updatingPayment
            if (paymentId) {
                // Если редактируется существующий счет
                updatingPayment = cloneDeep(payments[paymentId])
                updatingPayment.paymentId = paymentId
            }
            else {
                // Если создается новый счет
                updatingPayment = {...defaultNewPayment, members}
            }
            return {
                ...payments,
                [TEMPORARY_ID]: updatingPayment
            }
        }
        case SPENT_EQUALLY_SWITCHED: {
            const {spentEqually} = payload
            return {
                ...payments,
                [TEMPORARY_ID]: {
                    ...payments[TEMPORARY_ID],
                    spentEqually
                }
            }
        }
        case PAID_ONE_SWITCHED: {
            const {paidOne} = payload
            return {
                ...payments,
                [TEMPORARY_ID]: {
                    ...payments[TEMPORARY_ID],
                    paidOne
                }
            }
        }
        case REMOVE_MEMBER_FROM_PAYMENT: {
            const {personId} = payload
            let updatingPayment = cloneDeep(payments[TEMPORARY_ID])
            remove(updatingPayment.members, member => member.personId === personId)
            return {
                ...payments,
                [TEMPORARY_ID]: updatingPayment
            }
        }
        case CHANGE_MEMBER_SPENT_ON_PAYMENT: {
            const {personId, spent} = payload
            let updatingPayment = cloneDeep(payments[TEMPORARY_ID])
            const updatingMember = find(updatingPayment.members, member => member.personId == personId)
            updatingMember.spent = spent
            return {
                ...payments,
                [TEMPORARY_ID]: updatingPayment
            }
        }
        case UPDATE_PAYMENT: {
            const {paymentId, payment} = payload
            return {
                ...payments,
                [paymentId]: omit(payment, ['paymentId'])
            }
        }
        case CANCEL_UPDATING_PAYMENT: {
            return omit(payments, [TEMPORARY_ID])
        }
    }

    return payments
}
