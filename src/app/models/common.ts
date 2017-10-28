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

export interface IStoreItems<T> {
    items: IStorable<T>,
    current: T
}

export interface IStore {
    people: IStorable<IPerson>,
    trips: IStoreItems<IStoreTrip>,
    payments: IStoreItems<IStorePayment>,
    transfers: IStoreItems<ITransfer>,
}

export interface IKey {
    key: string
}
