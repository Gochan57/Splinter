import ADD_TRIP from '../constants'

export function addTrip(name) {
    return {
        type: ADD_TRIP,
        payload: {
            name
        }
    }
}