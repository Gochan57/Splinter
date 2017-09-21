import {
    IStoreTrip,
    ITrip
} from './trips'
import {IPayment} from './payments'
import {IPerson} from './people'
import {ITransfer} from './transfers'

export interface IStorable<T> {
    [key: string]: T
}

export interface IAction<T> {
    type: string,
    payload?: T
}

export interface IStore {
    people: IStorable<IPerson>,
    trips: IStorable<IStoreTrip>,
    payments: IStorable<IPayment>,
    transfers: IStorable<ITransfer>
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
    date: string
}