import { handleActions } from 'redux-actions'
import {ADD_TRIP, UPDATE_PAYMENT} from 'app/constants'
import {
    IAction,
    IStorable,
    IStore
} from 'app/models/common'
import {
    IPayloadAddTrip,
    IStoreTrip,
    ITrip
} from 'app/models/trips'
import {
    IPayloadUpdatePayment
} from '../models/payments'
import {cloneDeep, omit} from 'lodash'

const defaultTrips: IStorable<IStoreTrip> = {
    '1': {
        tripId: '1',
        name: 'Sri Lanka',
        people: ['1', '2', '3'],
        payments: ['1', '2', '3'],
        transfers: ['1'],
        settlingUp: {
            trades: [
                    {id: '1', fromPerson: '2', toPerson: '1', count:  100},
                    {id: '2', fromPerson: '3', toPerson: '1', count:  100},
                ],
            date: '01.09.2017 15:47'
        }

    },
    '2': {
        tripId: '2',
        name: 'Kazan',
        people: ['4', '5', '6'],
        payments: [],
        transfers: []
    },
    '3': {
        tripId: '3',
        name: 'Morocco',
        people: ['7', '8', '9'],
        payments: [],
        transfers: []
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
        return {...trips, [trip.tripId]: trip}
    },
    [UPDATE_PAYMENT]: function(trips: IStorable<IStoreTrip>, payload: IPayloadUpdatePayment): IStorable<IStoreTrip> {
        const {tripId, paymentId} = payload
        return {
            ...trips,
            [tripId]: {
                ...trips[tripId],
                payments: [
                    ...trips[tripId].payments,
                    paymentId
                ]
            }
        }
    }
}

