import {
    IAction,
    IStoreCurrent
} from '../models/common';
import {
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
    SET_CURRENT_PAYMENT,
    SET_CURRENT_TRIP,
    CANCEL_UPDATING_PAYMENT,
} from '../constants'
import {
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
    IStorePayment,
    IStoreMember,
    IPayloadSetCurrentPayment,
} from 'app/models/payments'
import {IPayloadSetCurrentTrip} from '../models/trips';

import * as _ from 'lodash'

const defaultCurents: IStoreCurrent = {
    trip: null,
    payment: null
}

export default (state = defaultCurents, action: IAction<any>) => {
    if (action && action.type && reducer[action.type]) {
        return reducer[action.type](state, action.payload)
    }
    return state
}

const reducer: {[key: string]: any} = {
    [SET_CURRENT_TRIP]: function (current: IStoreCurrent, payload: IPayloadSetCurrentTrip): IStoreCurrent {
        return {
            ...current,
            trip: payload.trip
        }
    },
    [SET_CURRENT_PAYMENT]: function (current: IStoreCurrent, payload: IPayloadSetCurrentPayment): IStoreCurrent {
        return {
            ...current,
            payment: payload.payment
        }
    },

    [CHANGE_PAYMENT_NAME]: function(current: IStoreCurrent, payload: IPayloadChangePaymentName): IStoreCurrent {
        const {name} = payload
        return {
            ...current,
            payment: {
                ...current.payment,
                name
            }
        }
    },
    [SET_MEMBERS_OF_PAYMENT]: function(current: IStoreCurrent, payload: IPayloadSetMembersOfPayment): IStoreCurrent {
        const {members} = payload
        let updatingPayment: IStorePayment = _.cloneDeep(current.payment)
        // Для уже существующих участников счета оставим данные как есть,
        // по остальным добавим в список участником объект {id}
        updatingPayment.members = members
        return {
            ...current,
            payment: updatingPayment
        }
    },
    [REMOVE_MEMBER_FROM_PAYMENT]: function(current: IStoreCurrent, payload: IPayloadRemoveMemberFromPayment): IStoreCurrent {
        const {personId} = payload
        let updatingPayment: IStorePayment = _.cloneDeep(current.payment)
        _.remove(updatingPayment.members, (member: IStoreMember) => member.personId === personId)
        return {
            ...current,
            payment: updatingPayment
        }
    },
    [SPENT_EQUALLY_SWITCHED]: function(current: IStoreCurrent, payload: IPayloadSpentEquallySwitched): IStoreCurrent {
        const {spentEqually} = payload
        return {
            ...current,
            payment: {
                ...current.payment,
                spentEqually
            }
        }
    },
    [PAID_ONE_SWITCHED]: function(current: IStoreCurrent, payload: IPayloadPaidOneSwitched): IStoreCurrent {
        const {paidOne} = payload
        let updatingPayment: IStorePayment = _.cloneDeep(current.payment)
        updatingPayment.paidOne = paidOne
        return {
            ...current,
            payment: updatingPayment
        }
    },
    [RESET_PAID_FOR_ALL]: function(current: IStoreCurrent, payload: {}): IStoreCurrent {
        let updatingPayment: IStorePayment = _.cloneDeep(current.payment)
        _.forEach(updatingPayment.members, (member: IStoreMember) => {
            member.paidForAll = false
        })
        return {
            ...current,
            payment: updatingPayment
        }
    },
    [CHANGE_SUM_ON_PAYMENT]: function(current: IStoreCurrent, payload: IPayloadChangeSumOnPayment): IStoreCurrent {
        const {sum} = payload
        return {
            ...current,
            payment: {
                ...current.payment,
                sum
            }
        }
    },
    [SPLIT_SUM_BY_MEMBERS]: function(current: IStoreCurrent, payload: IPayloadSplitSumByMembers): IStoreCurrent {
        const {spentEach} = payload
        let updatingPayment: IStorePayment = _.cloneDeep(current.payment)
        _.forEach(updatingPayment.members, (member: IStoreMember) => {member.spent = spentEach})
        return {
            ...current,
            payment: updatingPayment
        }
    },
    [PAID_FOR_ALL_CHECKED]: function(current: IStoreCurrent, payload: IPayloadPaidForAllChecked): IStoreCurrent {
        const {personId} = payload
        let updatingPayment: IStorePayment = _.cloneDeep(current.payment)
        _.forEach(updatingPayment.members, (member: IStoreMember) => {
            member.paidForAll = member.personId === personId
        })
        return {
            ...current,
            payment: updatingPayment
        }
    },
    [CHANGE_PAID_TO_PAY_FOR_ALL]: function(current: IStoreCurrent, payload: IPayloadChangePaidToPayForAll): IStoreCurrent {
        const {sumSpent, personId} = payload
        let updatingPayment: IStorePayment = _.cloneDeep(current.payment)
        let updatingMember: IStoreMember = _.find(updatingPayment.members, (member: IStoreMember) => member.personId === personId)
        updatingMember.paid = sumSpent
        _.forEach(updatingPayment.members, (member: IStoreMember) => {
            member.paid = (member.personId === personId ? sumSpent : 0)
        })
        return {
            ...current,
            payment: updatingPayment
        }
    },
    [CHANGE_MEMBER_SPENT_ON_PAYMENT]: function(current: IStoreCurrent, payload: IPayloadChangeMemberSpentOnPayment): IStoreCurrent {
        const {personId, spent, sum} = payload
        let updatingPayment: IStorePayment = _.cloneDeep(current.payment)
        updatingPayment.sum = sum
        let updatingMember: IStoreMember = _.find(updatingPayment.members, (member: IStoreMember) => member.personId === personId)
        updatingMember.spent = spent
        return {
            ...current,
            payment: updatingPayment
        }
    },
    [CHANGE_MEMBER_PAID_ON_PAYMENT]: function(current: IStoreCurrent, payload: IPayloadChangeMemberPaidOnPayment): IStoreCurrent {
        const {personId, paid} = payload
        const updatingPayment: IStorePayment = _.cloneDeep(current.payment)
        let updatingMember: IStoreMember = _.find(updatingPayment.members, (member: IStoreMember) => member.personId === personId)
        updatingMember.paid = paid
        return {
            ...current,
            payment: updatingPayment
        }
    },
    [CANCEL_UPDATING_PAYMENT]: function(current: IStoreCurrent, payload: IPayloadChangeMemberPaidOnPayment): IStoreCurrent {
        return {
            ...current,
            payment: null
        }
    }
}