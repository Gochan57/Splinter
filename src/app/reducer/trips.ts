import { handleActions } from 'redux-actions'
import {ADD_TRIP, UPDATE_PAYMENT} from 'app/constants'
import {
    IAction,
    IStorable
} from 'app/models/common'
import {
    IPayloadAddTrip,
    ITrip
} from 'app/models/trips'
import {
    IPayloadUpdatePayment
} from '../models/payments'
import {cloneDeep, omit} from 'lodash'

const defaultTrips: IStorable<ITrip> = {
    '1': {
        tripId: '1',
        name: 'Sri Lanka',
        people: ['1', '2', '3'],
        payments: ['1', '2', '3']
    },
    '2': {
        tripId: '2',
        name: 'Kazan',
        people: ['4', '5', '6'],
        payments: []
    },
    '3': {
        tripId: '3',
        name: 'Morocco',
        people: ['7', '8', '9'],
        payments: []
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
    [ADD_TRIP]: function(trips: IStorable<ITrip>, payload: IPayloadAddTrip): IStorable<ITrip> {
        const {trip} = payload
        return {...trips, [trip.tripId]: trip}
    },
    [UPDATE_PAYMENT]: function(trips: IStorable<ITrip>, payload: IPayloadUpdatePayment): IStorable<ITrip> {
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
