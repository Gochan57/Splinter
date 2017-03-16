import {ADD_TRIP} from '../constants'
// TODO Переделать на асинхронные экшны
export function addTrip(name) {
    return {
        type: ADD_TRIP,
        payload: {
            name
        }
    }
}

export function test (str) {
    return dispatch => {
        setTimeout(() => {
            dispatch({
                type: 'TEST',
                payload: str
            })
        }, 1000)
    }
}