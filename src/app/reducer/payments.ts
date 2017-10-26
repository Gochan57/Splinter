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
} from 'app/models/payments'
import { handleActions } from 'redux-actions'
import * as _ from 'lodash'

const defaultPayments: IStorable<IPayment> = {
    '1': {
        paymentId: '1',
        name: 'Супермаркет',
        date: new Date(2017, 2, 1, 17, 1, 24),
        members: [
            {id: '1', spent: 100, paid: 0},
            {id: '2', spent: 100, paid: 200, paidForAll: true},
        ],
        spentEqually: true,
        paidOne: true,
        sum: 200
    },
    '2': {
        paymentId: '2',
        name: 'Обучение у Сусы',
        date: new Date(2017, 2, 1, 10, 34, 12),
        members: [
            {id: '1', spent: 50, paid: 0},
            {id: '2', spent: 50, paid: 150, paidForAll: true},
            {id: '3', spent: 50, paid: 0},
        ],
        spentEqually: true,
        paidOne: true,
        sum: 150
    },
    '3': {
        paymentId: '3',
        name: 'Такси',
        date: new Date(2017, 2, 2, 12, 56, 1),
        members: [
            {id: '1', spent: 200, paid: 400, paidForAll: true},
            {id: '3', spent: 200, paid: 0},
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
            updatingPayment = _.cloneDeep(payments[paymentId])
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
        let updatingPayment: IPayment = _.cloneDeep(payments[TEMPORARY_ID])
        // Для уже существующих участников счета оставим данные как есть,
        // по остальным добавим в список участником объект {id}
        updatingPayment.members = personIdList.map(personId => {
            return _.find(updatingPayment.members, {id: personId}) || {id: personId}
        })
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [REMOVE_MEMBER_FROM_PAYMENT]: function(payments: IStorable<IPayment>, payload: IPayloadRemoveMemberFromPayment): IStorable<IPayment> {
        const {personId} = payload
        let updatingPayment: IPayment = _.cloneDeep(payments[TEMPORARY_ID])
        _.remove(updatingPayment.members, (member: IMember) => member.id === personId)
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
        let updatingPayment: IPayment = _.cloneDeep(payments[TEMPORARY_ID])
        updatingPayment.paidOne = paidOne
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [RESET_PAID_FOR_ALL]: function(payments: IStorable<IPayment>, payload: {}): IStorable<IPayment> {
        let updatingPayment: IPayment = _.cloneDeep(payments[TEMPORARY_ID])
        _.forEach(updatingPayment.members, (member: IMember) => {
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
        let updatingPayment: IPayment = _.cloneDeep(payments[TEMPORARY_ID])
        _.forEach(updatingPayment.members, (member: IMember) => {member.spent = spentEach})
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [PAID_FOR_ALL_CHECKED]: function(payments: IStorable<IPayment>, payload: IPayloadPaidForAllChecked): IStorable<IPayment> {
        const {personId} = payload
        let updatingPayment: IPayment = _.cloneDeep(payments[TEMPORARY_ID])
        _.forEach(updatingPayment.members, (member: IMember) => {
            member.paidForAll = member.id === personId
        })
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [CHANGE_PAID_TO_PAY_FOR_ALL]: function(payments: IStorable<IPayment>, payload: IPayloadChangePaidToPayForAll): IStorable<IPayment> {
        const {sumSpent, personId} = payload
        let updatingPayment: IPayment = _.cloneDeep(payments[TEMPORARY_ID])
        let updatingMember: IMember = _.find(updatingPayment.members, (member: IMember) => member.id === personId)
        updatingMember.paid = sumSpent
        _.forEach(updatingPayment.members, (member: IMember) => {
            member.paid = (member.id === personId ? sumSpent : 0)
        })
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [CHANGE_MEMBER_SPENT_ON_PAYMENT]: function(payments: IStorable<IPayment>, payload: IPayloadChangeMemberSpentOnPayment): IStorable<IPayment> {
        const {personId, spent, sum} = payload
        let updatingPayment: IPayment = _.cloneDeep(payments[TEMPORARY_ID])
        updatingPayment.sum = sum
        let updatingMember: IMember = _.find(updatingPayment.members, (member: IMember) => member.id === personId)
        updatingMember.spent = spent
        return {
            ...payments,
            [TEMPORARY_ID]: updatingPayment
        }
    },
    [CHANGE_MEMBER_PAID_ON_PAYMENT]: function(payments: IStorable<IPayment>, payload: IPayloadChangeMemberPaidOnPayment): IStorable<IPayment> {
        const {personId, paid} = payload
        const updatingPayment: IPayment = _.cloneDeep(payments[TEMPORARY_ID])
        let updatingMember: IMember = _.find(updatingPayment.members, (member: IMember) => member.id === personId)
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
            [paymentId]: _.omit(payment, ['paymentId'])
        }
    },
    [CANCEL_UPDATING_PAYMENT]: function(payments: IStorable<IPayment>, payload: IPayloadStartUpdatingPayment): IStorable<IPayment> {
        return _.omit(payments, [TEMPORARY_ID])
    }
}
