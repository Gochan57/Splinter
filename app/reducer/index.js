import { combineReducers } from 'redux'
import trips from './trips'
import payments from './payments'

export default combineReducers({
    trips,
    payments
})