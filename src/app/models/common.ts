import {
    IStoreTrip,
    ITrip
} from './trips'
import {
    IPayment,
    IStorePayment
} from './payments'
import {IPerson} from './people'
import {ITransfer} from './transfers'

export interface IStorable<T> {
    [key: string]: T
}

export interface IAction<T> {
    type: string,
    payload?: T
}

export interface IStoreCurrent {
    trip: IStoreTrip,
    payment: IStorePayment
}

export interface IStore {
    people: IStorable<IPerson>,
    trips: IStorable<IStoreTrip>,
    payments: IStorable<IStorePayment>,
    transfers: IStorable<ITransfer>,
    current: IStoreCurrent,
}

export interface IKey {
    key: string
}

/**
 * Объект, имеющий поле date.
 *
 * date Дата в формате ISO-8601.
 */
export interface IDateble {
    date: Date
}