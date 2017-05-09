import {ADD_TRIP, START_CREATING_NEW_PAYMENT} from '../constants'
import {getMaxId} from 'app/utils/utils'
import {cloneDeep} from 'lodash'

const trips = {
    '1': {
        name: 'Sri Lanka',
        people: {
            '1': {name: 'Юля'},
            '2': {name: 'Гоша'},
            '3': {name: 'Вова'},
        },
        payments: ['1', '2', '3']
    },
    '2': {
        name: 'Kazan',
        people: {
            '4': {name: 'Юля'},
            '5': {name: 'Надя'},
            '6': {name: 'Костя'},
        }
    },
    '3': {
        name: 'Morocco',
        people: {
            '7': {name: 'Саня'},
            '8': {name: 'Мегги'},
            '9': {name: 'Гоша'},
        }
    }
}

export default (state = trips, action) => {
    console.log('trip action:', action)
    const {type, payload} = action

    switch(type) {
        case ADD_TRIP: {
            const {name, people} = payload
            const newId = getMaxId(state) + 1
            const newState = {...state, [newId]: {name}}
            return newState
        }
        case START_CREATING_NEW_PAYMENT: {
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

    return state
}
