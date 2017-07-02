import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducer from '../reducer'
import {createLogger} from 'redux-logger'

export default store = createStore(reducer, applyMiddleware(ReduxThunk, createLogger()))
