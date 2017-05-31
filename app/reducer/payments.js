import {
    START_UPDATING_PAYMENT,
    CHANGE_PAYMENT_NAME,
    REMOVE_MEMBER_FROM_PAYMENT,
    SPENT_EQUALLY_SWITCHED,
    PAID_ONE_SWITCHED,
    RESET_PAID_FOR_ALL,
    CHANGE_SUM_ON_PAYMENT,
    SPLIT_SUM_BY_MEMBERS,
    PAID_FOR_ALL_CHECKED,
    CHANGE_PAID_TO_PAY_FOR_ALL,
    CHANGE_MEMBER_SPENT_ON_PAYMENT,
    CHANGE_MEMBER_PAID_ON_PAYMENT,
    UPDATE_PAYMENT,
    CANCEL_UPDATING_PAYMENT,
    TEMPORARY_ID,
} from '../constants'
import {cloneDeep, find, forEach, remove, omit} from 'lodash'

const defaultPayments = {
    '1': {
        name: 'Супермаркет',
        date: '01.02.2017 17:01:24',
        members: [
            {personId: '1', spent: 100, paid: 0},
            {personId: '2', spent: 100, paid: 200, paidForAll: true},
        ],
        spentEqually: true,
        paidOne: true,
        sum: 200
    },
    '2': {
        name: 'Обучение у Сусы',
        date: '01.02.2017 10:34:12',
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
        name: 'Такси',
        date: '02.02.2017 12:56:01',
        members: [
            {personId: '1', spent: 200, paid: 400, paidForAll: true},
            {personId: '3', spent: 200, paid: 0},
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
        case CHANGE_PAYMENT_NAME: {
            const {name} = payload
            return {
                ...payments,
                [TEMPORARY_ID]: {
                    ...payments[TEMPORARY_ID],
                    name
                }
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
            let updatingPayment = cloneDeep(payments[TEMPORARY_ID])
            updatingPayment.paidOne = paidOne
            return {
                ...payments,
                [TEMPORARY_ID]: updatingPayment
            }
        }
        case RESET_PAID_FOR_ALL: {
            const {paidOne} = payload
            let updatingPayment = cloneDeep(payments[TEMPORARY_ID])
            forEach(updatingPayment.members, member => {
                member.paidForAll = false
            })
            return {
                ...payments,
                [TEMPORARY_ID]: updatingPayment
            }
        }
        case CHANGE_SUM_ON_PAYMENT: {
            const {sum} = payload
            return {
                ...payments,
                [TEMPORARY_ID]: {
                    ...payments[TEMPORARY_ID],
                    sum
                }
            }
        }
        case SPLIT_SUM_BY_MEMBERS: {
            const {spentEach} = payload
            let updatingPayment = cloneDeep(payments[TEMPORARY_ID])
            forEach(updatingPayment.members, member => {member.spent = spentEach})
            return {
                ...payments,
                [TEMPORARY_ID]: updatingPayment
            }
        }
        case PAID_FOR_ALL_CHECKED: {
            const {personId} = payload
            let updatingPayment = cloneDeep(payments[TEMPORARY_ID])
            forEach(updatingPayment.members, member => {
                member.paidForAll = member.personId == personId
            })
            return {
                ...payments,
                [TEMPORARY_ID]: updatingPayment
            }
        }
        case CHANGE_PAID_TO_PAY_FOR_ALL: {
            const {sumSpent, personId} = payload
            let updatingPayment = cloneDeep(payments[TEMPORARY_ID])
            let updatingMember = find(updatingPayment.members, member => member.personId == personId)
            updatingMember.paid = sumSpent
            forEach(updatingPayment.members, member => {
                member.paid = (member.personId == personId ? sumSpent : 0)
            })
            return {
                ...payments,
                [TEMPORARY_ID]: updatingPayment
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
            const {personId, spent, sum} = payload
            let updatingPayment = cloneDeep(payments[TEMPORARY_ID])
            updatingPayment.sum = sum
            let updatingMember = find(updatingPayment.members, member => member.personId == personId)
            updatingMember.spent = spent
            return {
                ...payments,
                [TEMPORARY_ID]: updatingPayment
            }
        }
        case CHANGE_MEMBER_PAID_ON_PAYMENT: {
            const {personId, paid} = payload
            const updatingPayment = cloneDeep(payments[TEMPORARY_ID])
            let updatingMember = find(updatingPayment.members, member => member.personId == personId)
            updatingMember.paid = paid
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
