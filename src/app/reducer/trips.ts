import { handleActions } from 'redux-actions'
import {
    ADD_TRANSFER_CHAIN,
    ADD_TRIP,
    SETTLE_UP,
    UPDATE_PAYMENT
} from 'app/constants'
import {
    IAction,
    IStorable,
    IStore
} from 'app/models/common'
import {
    IPayloadAddTrip,
    IPayloadSettleUpTrip,
    IStoreTrip,
    ITrip
} from 'app/models/trips'
import {
    IPayloadUpdatePayment
} from '../models/payments'
import * as _ from 'lodash'
import {IPayloadAddTransfer} from '../models/transfers';

const defaultTrips: IStorable<IStoreTrip> = {
    '1': {
        id: '1',
        name: 'Sri Lanka',
        people: ['1', '2', '3'],
        payments: ['1', '2', '3'],
        transfers: ['1'],
        settlingUp: {
            trades: [
                    {id: '1', fromPerson: '2', toPerson: '1', count:  100},
                    {id: '2', fromPerson: '3', toPerson: '1', count:  100},
                ],
            date: new Date(2017, 9, 1, 15, 47, 0)
        },
        date: new Date(2017, 9, 21)
    },
    '2': {
        id: '2',
        name: 'Kazan',
        people: ['4', '5', '6'],
        payments: [],
        transfers: [],
        date: new Date(2016, 6, 16)
    },
    '3': {
        id: '3',
        name: 'Morocco',
        people: ['7', '8', '9'],
        payments: [],
        transfers: [],
        date: new Date(2015, 1, 1)
    }
}

export default (state = defaultTrips, action: IAction<any>) => {
    if (action && action.type && reducer[action.type]) {
        return reducer[action.type](state, action.payload)
    }
    return state
}

// Указанный тип у reducer - небольшой хак, чтобы обмануть typescript насчет нисходящего приведения типов.
// По-хорошему, ни здесь ни сверху в типе action не должно быть указано any.
// Однако в таком виде ts не ругается, и для каждого действия задана типизация payload, к чему и стремились.
const reducer: {[key: string]: any} = {
    [ADD_TRIP]: function(trips: IStorable<IStoreTrip>, payload: IPayloadAddTrip): IStorable<IStoreTrip> {
        const {trip} = payload
        return {...trips, [trip.id]: trip}
    },
    [SETTLE_UP]: function(trips: IStorable<IStoreTrip>, payload: IPayloadSettleUpTrip): IStorable<IStoreTrip> {
        const {tripId, settlingUp} = payload
        return {
            ...trips,
            [tripId]: {
                ...trips[tripId],
                settlingUp
            }
        }
    },
    [UPDATE_PAYMENT]: function(trips: IStorable<IStoreTrip>, payload: IPayloadUpdatePayment): IStorable<IStoreTrip> {
        const {tripId, payment} = payload
        return {
            ...trips,
            [tripId]: {
                ...trips[tripId],
                payments: [
                    ...trips[tripId].payments,
                    payment.id
                ]
            }
        }
    },
    [ADD_TRANSFER_CHAIN]: function(trips: IStorable<IStoreTrip>, payload: IPayloadAddTransfer): IStorable<IStoreTrip> {
        const {tripId, transfer} = payload
        return {
            ...trips,
            [tripId]: {
                ...trips[tripId],
                transfers: [
                    ...trips[tripId].transfers,
                    transfer.id
                ]
            }
        }
    }
}


