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
    IPayloadChangeMemberSpentOnPayment,
    IPayloadChangeMemberPaidOnPayment,
    IPayloadUpdatePayment,
    IMember,
    IPayment,
    IStorePayment,
    IStoreMember,
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

const defaultNewPayment: IStorePayment = {
    id: undefined,
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
    [START_UPDATING_PAYMENT]: function(payments: IStorable<IStorePayment>, payload: IPayloadStartUpdatingPayment): IStorable<IStorePayment> {
        // Создадим в payments поле с ключом -1, куда скопируем редактируемый счет,
        // или, в случае создания нового счета,  defaultNewPayment.
        // При редактировании счета будем менять именно этот счет, а затем,
        // по нажатию "Сохранить", скопируем новые значения в поля оригинального счета.

        // paymentId передается в случае редактирования существующего счета.
        // members передается в случае создания нового счета (по умолчанию это все участники путешествия).
        const {paymentId, members} = payload

        let updatingPayment: IStorePayment
        if (paymentId) {
            // Если редактируется существующий счет
            updatingPayment = _.cloneDeep(payments[paymentId])
            updatingPayment.id = paymentId
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
    [CHANGE_PAYMENT_NAME]: function(payments: IStorable<IStorePayment>, payload: IPayloadChangePaymentName): IStorable<IStorePayment> {
        const {name} = payload
        return {
            ...payments,
            [TEMPORARY_ID]: {
                ...payments[TEMPORARY_ID],
                name
            }
        }
    },
    [SET_MEMBERS_OF_PAYMENT]: function(payments: IStorable<IStorePayment>, payload: IPayloadSetMembersOfPayment): IStorable<IStorePayment> {
        const {members} = payload
        let updatingPayment: IStorePayment = _.cloneDeep(payments[TEMPORARY_ID])
        // Для уже существующих участников счета оставим данные как есть,
        // по остальным добавим в список участником объект {id}
        updatingPayment.members = members
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [REMOVE_MEMBER_FROM_PAYMENT]: function(payments: IStorable<IStorePayment>, payload: IPayloadRemoveMemberFromPayment): IStorable<IStorePayment> {
        const {personId} = payload
        let updatingPayment: IStorePayment = _.cloneDeep(payments[TEMPORARY_ID])
        _.remove(updatingPayment.members, (member: IStoreMember) => member.personId === personId)
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [SPENT_EQUALLY_SWITCHED]: function(payments: IStorable<IStorePayment>, payload: IPayloadSpentEquallySwitched): IStorable<IStorePayment> {
        const {spentEqually} = payload
        return {
            ...payments,
            [TEMPORARY_ID]: {
                ...payments[TEMPORARY_ID],
                spentEqually
            }
        }
    },
    [PAID_ONE_SWITCHED]: function(payments: IStorable<IStorePayment>, payload: IPayloadPaidOneSwitched): IStorable<IStorePayment> {
        const {paidOne} = payload
        let updatingPayment: IStorePayment = _.cloneDeep(payments[TEMPORARY_ID])
        updatingPayment.paidOne = paidOne
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [RESET_PAID_FOR_ALL]: function(payments: IStorable<IStorePayment>, payload: {}): IStorable<IStorePayment> {
        let updatingPayment: IStorePayment = _.cloneDeep(payments[TEMPORARY_ID])
        _.forEach(updatingPayment.members, (member: IStoreMember) => {
            member.paidForAll = false
        })
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [CHANGE_SUM_ON_PAYMENT]: function(payments: IStorable<IStorePayment>, payload: IPayloadChangeSumOnPayment): IStorable<IStorePayment> {
        const {sum} = payload
        return {
            ...payments,
            [TEMPORARY_ID]: {
                ...payments[TEMPORARY_ID],
                sum
            }
        }
    },
    [SPLIT_SUM_BY_MEMBERS]: function(payments: IStorable<IStorePayment>, payload: IPayloadSplitSumByMembers): IStorable<IStorePayment> {
        const {spentEach} = payload
        let updatingPayment: IStorePayment = _.cloneDeep(payments[TEMPORARY_ID])
        _.forEach(updatingPayment.members, (member: IStoreMember) => {member.spent = spentEach})
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [PAID_FOR_ALL_CHECKED]: function(payments: IStorable<IStorePayment>, payload: IPayloadPaidForAllChecked): IStorable<IStorePayment> {
        const {personId} = payload
        let updatingPayment: IStorePayment = _.cloneDeep(payments[TEMPORARY_ID])
        _.forEach(updatingPayment.members, (member: IStoreMember) => {
            member.paidForAll = member.personId === personId
        })
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [CHANGE_PAID_TO_PAY_FOR_ALL]: function(payments: IStorable<IStorePayment>, payload: IPayloadChangePaidToPayForAll): IStorable<IStorePayment> {
        const {sumSpent, personId} = payload
        let updatingPayment: IStorePayment = _.cloneDeep(payments[TEMPORARY_ID])
        let updatingMember: IStoreMember = _.find(updatingPayment.members, (member: IStoreMember) => member.personId === personId)
        updatingMember.paid = sumSpent
        _.forEach(updatingPayment.members, (member: IStoreMember) => {
            member.paid = (member.personId === personId ? sumSpent : 0)
        })
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [CHANGE_MEMBER_SPENT_ON_PAYMENT]: function(payments: IStorable<IStorePayment>, payload: IPayloadChangeMemberSpentOnPayment): IStorable<IStorePayment> {
        const {personId, spent, sum} = payload
        let updatingPayment: IStorePayment = _.cloneDeep(payments[TEMPORARY_ID])
        updatingPayment.sum = sum
        let updatingMember: IStoreMember = _.find(updatingPayment.members, (member: IStoreMember) => member.personId === personId)
        updatingMember.spent = spent
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [CHANGE_MEMBER_PAID_ON_PAYMENT]: function(payments: IStorable<IStorePayment>, payload: IPayloadChangeMemberPaidOnPayment): IStorable<IStorePayment> {
        const {personId, paid} = payload
        const updatingPayment: IStorePayment = _.cloneDeep(payments[TEMPORARY_ID])
        let updatingMember: IStoreMember = _.find(updatingPayment.members, (member: IStoreMember) => member.personId === personId)
        updatingMember.paid = paid
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [UPDATE_PAYMENT]: function(payments: IStorable<IStorePayment>, payload: IPayloadUpdatePayment): IStorable<IStorePayment> {
        const {payment} = payload
        return {
            ...payments,
            [payment.id]: payment
        }
    },
    [CANCEL_UPDATING_PAYMENT]: function(payments: IStorable<IStorePayment>, payload: IPayloadStartUpdatingPayment): IStorable<IStorePayment> {
        return _.omit(payments, [TEMPORARY_ID])
    }
}
