import { combineReducers } from 'redux'
import people from './people'
import trips from './trips'
import payments from './payments'

export default combineReducers({
    people,
    trips,
    payments
})