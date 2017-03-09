import {ADD_TRIP} from '../constants'
import {getMaxId} from 'app/utils/utils'

const trips = {
    '1': {name: 'Sri Lanka'},
    '2': {name: 'Kazan'},
    '3': {name: 'Morocco'},
}

export default (state = trips, action) => {
    console.log('action:', action)
    const {type, payload} = action

    switch(type) {
        case ADD_TRIP: {
            const {name} = payload
            const newId = getMaxId(state) + 1
            const newState = {...state, [newId]: {name}}
            console.log('newState:', newState)
            return newState
        }
    }

    return state
}
