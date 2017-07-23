import {ITrip} from './trips'
import {IPayment} from './payments'
import {IPerson} from './people'
export interface IStorable<T> {
    [key: string]: T
}

export interface IAction<T> {
    type: string,
    payload?: T
}

export interface IStore {
    people: IStorable<IPerson>,
    trips: IStorable<ITrip>,
    payments: IStorable<IPayment>
}

export interface IKey {
    key: string
}