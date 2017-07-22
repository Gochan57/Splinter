import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducer from '../reducer'
import {createLogger} from 'redux-logger'

const store = createStore(reducer, applyMiddleware(ReduxThunk, createLogger()))
export default store
