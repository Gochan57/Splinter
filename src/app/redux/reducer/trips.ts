import {handleActions} from 'redux-actions'
import {
    IStoreItems,
} from 'app/models/common'
import {
    IStoreTrip,
} from 'app/models/trips'
import {IAction} from '../action/index';

import * as _ from 'lodash'

const defaultTrips: IStoreItems<IStoreTrip> = {
    items: {
        '1': {
            id: '1',
            name: 'Sri Lanka',
            people: ['1', '2', '3'],
            payments: ['1', '2', '3'],
            transfers: ['1'],
            settlingUp: {
                trades: [
                    {
                        id: '1',
                        fromPerson: '2',
                        toPerson: '1',
                        count: 100
                    },
                    {
                        id: '2',
                        fromPerson: '3',
                        toPerson: '1',
                        count: 100
                    },
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
    },
    current: null
}

export default (trips: IStoreItems<IStoreTrip> = defaultTrips, action: IAction): IStoreItems<IStoreTrip> => {
    if (!action) return trips

    switch (action.type) {
        case 'ADD_TRIP': {
            const {trip} = action.payload
            return {
                ...trips,
                items: {
                    ...trips.items,
                    [trip.id]: trip
                }
            }
        }
        case 'SETTLE_UP': {
            const {tripId, settlingUp} = action.payload
            return {
                ...trips,
                items: {
                    ...trips.items,
                    [tripId]: {
                        ...trips.items[tripId],
                        settlingUp
                    }
                }
            }
        }
        case 'UPDATE_PAYMENT': {
            const {tripId, payment} = action.payload
            return {
                ...trips,
                items: {
                    ...trips.items,
                    [tripId]: {
                        ...trips.items[tripId],
                        payments: [
                            ...trips.items[tripId].payments,
                            payment.id
                        ]
                    }
                }
            }
        }
        case 'ADD_TRANSFER_CHAIN': {
            const {tripId, transfer} = action.payload
            return {
                ...trips,
                items: {
                    ...trips.items,
                    [tripId]: {
                        ...trips.items[tripId],
                        transfers: [
                            ...trips.items[tripId].transfers,
                            transfer.id
                        ]
                    }
                }
            }
        }
        case 'SET_CURRENT_TRIP': {
            const {trip} = action.payload
            return {
                ...trips,
                current: trip
            }
        }
        default: {
            return trips
        }
    }
}
