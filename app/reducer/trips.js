import ADD_TRIP from '../constants'

export default (state, action) => {
    const {type, payload} = action

    switch(type) {
        case ADD_TRIP: {
            const {id, name} = payload
            return [...state, {id, name}]
        }
    }

    return state
}
