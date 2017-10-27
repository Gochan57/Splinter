import { combineReducers } from 'redux'
import people from './people'
import trips from './trips'
import payments from './payments'
import transfers from './transfers'
import current from './current'

export default combineReducers({
    people,
    trips,
    payments,
    transfers,
    current
})