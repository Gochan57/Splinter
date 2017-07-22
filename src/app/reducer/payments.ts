import {
    START_UPDATING_PAYMENT,
    CHANGE_PAYMENT_NAME,
    SET_MEMBERS_OF_PAYMENT,
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
import {
    IAction,
    IStorable
} from 'app/models/common'
import {
    IPayloadStartUpdatingPayment,
    IPayloadChangePaymentName,
    IPayloadSetMembersOfPayment,
    IPayloadRemoveMemberFromPayment,
    IPayloadSpentEquallySwitched,
    IPayloadPaidOneSwitched,
    IPayloadChangeSumOnPayment,
    IPayloadSplitSumByMembers,
    IPayloadPaidForAllChecked,
    IPayloadChangePaidToPayForAll,
    IPayloadСhangeMemberSpentOnPayment,
    IPayloadChangeMemberPaidOnPayment,
    IPayloadUpdatePayment,
    IMember,
    IPayment,
} from 'app/models/payments'
import { handleActions } from 'redux-actions'
import {cloneDeep, find, forEach, some, remove, omit} from 'lodash'

const defaultPayments: IStorable<IPayment> = {
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

const defaultNewPayment: IPayment = {
    paymentId: undefined,
    members: [],
    spentEqually: false,
    paidOne: false,
    sum: 0
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
    [START_UPDATING_PAYMENT]: function(payments: IStorable<IPayment>, payload: IPayloadStartUpdatingPayment): IStorable<IPayment> {
        // Создадим в payments поле с ключом -1, куда скопируем редактируемый счет,
        // или, в случае создания нового счета,  defaultNewPayment.
        // При редактировании счета будем менять именно этот счет, а затем,
        // по нажатию "Сохранить", скопируем новые значения в поля оригинального счета.

        // paymentId передается в случае редактирования существующего счета.
        // members передается в случае создания нового счета (по умолчанию это все участники путешествия).
        const {paymentId, members} = payload

        let updatingPayment: IPayment
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
    },
    [CHANGE_PAYMENT_NAME]: function(payments: IStorable<IPayment>, payload: IPayloadChangePaymentName): IStorable<IPayment> {
        const {name} = payload
        return {
            ...payments,
            [TEMPORARY_ID]: {
                ...payments[TEMPORARY_ID],
                name
            }
        }
    },
    [SET_MEMBERS_OF_PAYMENT]: function(payments: IStorable<IPayment>, payload: IPayloadSetMembersOfPayment): IStorable<IPayment> {
        const {personIdList} = payload
        let updatingPayment: IPayment = cloneDeep(payments[TEMPORARY_ID])
        // Для уже существующих участников счета оставим данные как есть,
        // по остальным добавим в список участником объект {personId}
        updatingPayment.members = personIdList.map(personId => {
            return find(updatingPayment.members, {personId: personId}) || {personId}
        })
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [REMOVE_MEMBER_FROM_PAYMENT]: function(payments: IStorable<IPayment>, payload: IPayloadRemoveMemberFromPayment): IStorable<IPayment> {
        const {personId} = payload
        let updatingPayment: IPayment = cloneDeep(payments[TEMPORARY_ID])
        remove(updatingPayment.members, (member: IMember) => member.personId === personId)
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [SPENT_EQUALLY_SWITCHED]: function(payments: IStorable<IPayment>, payload: IPayloadSpentEquallySwitched): IStorable<IPayment> {
        const {spentEqually} = payload
        return {
            ...payments,
            [TEMPORARY_ID]: {
                ...payments[TEMPORARY_ID],
                spentEqually
            }
        }
    },
    [PAID_ONE_SWITCHED]: function(payments: IStorable<IPayment>, payload: IPayloadPaidOneSwitched): IStorable<IPayment> {
        const {paidOne} = payload
        let updatingPayment: IPayment = cloneDeep(payments[TEMPORARY_ID])
        updatingPayment.paidOne = paidOne
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [RESET_PAID_FOR_ALL]: function(payments: IStorable<IPayment>, payload: {}): IStorable<IPayment> {
        let updatingPayment: IPayment = cloneDeep(payments[TEMPORARY_ID])
        forEach(updatingPayment.members, (member: IMember) => {
            member.paidForAll = false
        })
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [CHANGE_SUM_ON_PAYMENT]: function(payments: IStorable<IPayment>, payload: IPayloadChangeSumOnPayment): IStorable<IPayment> {
        const {sum} = payload
        return {
            ...payments,
            [TEMPORARY_ID]: {
                ...payments[TEMPORARY_ID],
                sum
            }
        }
    },
    [SPLIT_SUM_BY_MEMBERS]: function(payments: IStorable<IPayment>, payload: IPayloadSplitSumByMembers): IStorable<IPayment> {
        const {spentEach} = payload
        let updatingPayment: IPayment = cloneDeep(payments[TEMPORARY_ID])
        forEach(updatingPayment.members, (member: IMember) => {member.spent = spentEach})
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [PAID_FOR_ALL_CHECKED]: function(payments: IStorable<IPayment>, payload: IPayloadPaidForAllChecked): IStorable<IPayment> {
        const {personId} = payload
        let updatingPayment: IPayment = cloneDeep(payments[TEMPORARY_ID])
        forEach(updatingPayment.members, (member: IMember) => {
            member.paidForAll = member.personId === personId
        })
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [CHANGE_PAID_TO_PAY_FOR_ALL]: function(payments: IStorable<IPayment>, payload: IPayloadChangePaidToPayForAll): IStorable<IPayment> {
        const {sumSpent, personId} = payload
        let updatingPayment: IPayment = cloneDeep(payments[TEMPORARY_ID])
        let updatingMember: IMember = find(updatingPayment.members, (member: IMember) => member.personId === personId)
        updatingMember.paid = sumSpent
        forEach(updatingPayment.members, (member: IMember) => {
            member.paid = (member.personId === personId ? sumSpent : 0)
        })
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [CHANGE_MEMBER_SPENT_ON_PAYMENT]: function(payments: IStorable<IPayment>, payload: IPayloadСhangeMemberSpentOnPayment): IStorable<IPayment> {
        const {personId, spent, sum} = payload
        let updatingPayment: IPayment = cloneDeep(payments[TEMPORARY_ID])
        updatingPayment.sum = sum
        let updatingMember: IMember = find(updatingPayment.members, (member: IMember) => member.personId === personId)
        updatingMember.spent = spent
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [CHANGE_MEMBER_PAID_ON_PAYMENT]: function(payments: IStorable<IPayment>, payload: IPayloadChangeMemberPaidOnPayment): IStorable<IPayment> {
        const {personId, paid} = payload
        const updatingPayment = cloneDeep(payments[TEMPORARY_ID])
        let updatingMember: IMember = find(updatingPayment.members, (member: IMember) => member.personId === personId)
        updatingMember.paid = paid
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [UPDATE_PAYMENT]: function(payments: IStorable<IPayment>, payload: IPayloadUpdatePayment): IStorable<IPayment> {
        const {paymentId, payment} = payload
        return {
            ...payments,
            [paymentId]: omit(payment, ['paymentId'])
        }
    },
    [CANCEL_UPDATING_PAYMENT]: function(payments: IStorable<IPayment>, payload: IPayloadStartUpdatingPayment): IStorable<IPayment> {
        return omit(payments, [TEMPORARY_ID])
    }
}
