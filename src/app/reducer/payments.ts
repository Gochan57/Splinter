import {
    IAction,
    IStorable,
    IStoreItems
} from 'app/models/common'
import {
    IStorePayment,
    IStoreMember,
} from 'app/models/payments'
import { handleActions } from 'redux-actions'
import * as _ from 'lodash'

const defaultPayments: IStoreItems<IStorePayment> = {
    items: {
        '1': {
            id: '1',
            name: 'Супермаркет',
            date: new Date(2017, 2, 1, 17, 1, 24),
            members: [
                {
                    personId: '1',
                    spent: 100,
                    paid: 0
                },
                {
                    personId: '2',
                    spent: 100,
                    paid: 200,
                    paidForAll: true
                },
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
                {
                    personId: '1',
                    spent: 50,
                    paid: 0
                },
                {
                    personId: '2',
                    spent: 50,
                    paid: 150,
                    paidForAll: true
                },
                {
                    personId: '3',
                    spent: 50,
                    paid: 0
                },
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
                {
                    personId: '1',
                    spent: 200,
                    paid: 400,
                    paidForAll: true
                },
                {
                    personId: '3',
                    spent: 200,
                    paid: 0
                },
            ],
            spentEqually: true,
            paidOne: true,
            sum: 400
        }
    },
    current: null
}

export default (state: IStoreItems<IStorePayment> = defaultPayments, action: IAction<any>): IStoreItems<IStorePayment> => {
    if (!action) return state

    switch (action.type) {
        case 'SET_CURRENT_PAYMENT': {
            const {payment} = action.payload
            return {
                ...state,
                current: payment
            }
        }
        case 'UPDATE_PAYMENT': {
            const {payment} = action.payload
            return {
                ...state,
                items: {
                    ...state.items,
                    [payment.id]: payment
                }
            }
        }
        case 'CHANGE_PAYMENT_NAME': {
            const {name} = action.payload
            return {
                ...state,
                current: {
                    ...state.current,
                    name
                }
            }
        }
        case 'SET_MEMBERS_OF_PAYMENT': {
            const {members} = action.payload
            let updatingPayment: IStorePayment = _.cloneDeep(state.current)
            // Для уже существующих участников счета оставим данные как есть,
            // по остальным добавим в список участником объект {id}
            updatingPayment.members = members
            return {
                ...state,
                current: updatingPayment
            }
        }
        case 'REMOVE_MEMBER_FROM_PAYMENT': {
            const {personId} = action.payload
            let updatingPayment: IStorePayment = _.cloneDeep(state.current)
            _.remove(updatingPayment.members, (member: IStoreMember) => member.personId === personId)
            return {
                ...state,
                current: updatingPayment
            }
        }
        case 'SPENT_EQUALLY_SWITCHED': {
            const {spentEqually} = action.payload
            return {
                ...state,
                current: {
                    ...state.current,
                    spentEqually
                }
            }
        }
        case 'PAID_ONE_SWITCHED': {
            const {paidOne} = action.payload
            let updatingPayment: IStorePayment = _.cloneDeep(state.current)
            updatingPayment.paidOne = paidOne
            return {
                ...state,
                current: updatingPayment
            }
        }
        case 'RESET_PAID_FOR_ALL': {
            let updatingPayment: IStorePayment = _.cloneDeep(state.current)
            _.forEach(updatingPayment.members, (member: IStoreMember) => {
                member.paidForAll = false
            })
            return {
                ...state,
                current: updatingPayment
            }
        }
        case 'CHANGE_SUM_ON_PAYMENT': {
            const {sum} = action.payload
            return {
                ...state,
                current: {
                    ...state.current,
                    sum
                }
            }
        }
        case 'SPLIT_SUM_BY_MEMBERS': {
            const {spentEach} = action.payload
            let updatingPayment: IStorePayment = _.cloneDeep(state.current)
            _.forEach(updatingPayment.members, (member: IStoreMember) => {member.spent = spentEach})
            return {
                ...state,
                current: updatingPayment
            }
        }
        case 'PAID_FOR_ALL_CHECKED': {
            const {personId} = action.payload
            let updatingPayment: IStorePayment = _.cloneDeep(state.current)
            _.forEach(updatingPayment.members, (member: IStoreMember) => {
                member.paidForAll = member.personId === personId
            })
            return {
                ...state,
                current: updatingPayment
            }
        }
        case 'CHANGE_PAID_TO_PAY_FOR_ALL': {
            const {sumSpent, personId} = action.payload
            let updatingPayment: IStorePayment = _.cloneDeep(state.current)
            let updatingMember: IStoreMember = _.find(updatingPayment.members, (member: IStoreMember) => member.personId === personId)
            updatingMember.paid = sumSpent
            _.forEach(updatingPayment.members, (member: IStoreMember) => {
                member.paid = (member.personId === personId ? sumSpent : 0)
            })
            return {
                ...state,
                current: updatingPayment
            }
        }
        case 'CHANGE_MEMBER_SPENT_ON_PAYMENT': {
            const {personId, spent, sum} = action.payload
            let updatingPayment: IStorePayment = _.cloneDeep(state.current)
            updatingPayment.sum = sum
            let updatingMember: IStoreMember = _.find(updatingPayment.members, (member: IStoreMember) => member.personId === personId)
            updatingMember.spent = spent
            return {
                ...state,
                current: updatingPayment
            }
        }
        case 'CHANGE_MEMBER_PAID_ON_PAYMENT': {
            const {personId, paid} = action.payload
            const updatingPayment: IStorePayment = _.cloneDeep(state.current)
            let updatingMember: IStoreMember = _.find(updatingPayment.members, (member: IStoreMember) => member.personId === personId)
            updatingMember.paid = paid
            return {
                ...state,
                current: updatingPayment
            }
        }
        case 'CANCEL_UPDATING_PAYMENT': {
            return {
                ...state,
                current: null
            }
        }
        default: {
            return state
        }
    }
}
