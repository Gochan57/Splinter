import {ITrip} from './trips'
import {IPayment} from './payments'
export interface IStorable<T> {
    [key: string]: T
}

export interface IAction<T> {
    type: string,
    payload?: T
}

export interface IStore {
    trips: IStorable<ITrip>,
    payments: IStorable<IPayment>
}
