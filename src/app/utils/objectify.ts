import {IStore} from '../models/common'
import {
    IStoreTrip,
    ITrip
} from '../models/trips'
import {
    ISettlingUp,
    IStoreSettlingUp,
    IStoreTrade,
    ITrade,
} from 'app/models/transfers'

export const objectifyTrade = (state: IStore, storeTrade: IStoreTrade): ITrade => {
    if (!storeTrade) {
        return null
    }
    return {
        id: storeTrade.id,
        fromPerson: state.people[storeTrade.fromPerson],
        toPerson: state.people[storeTrade.toPerson],
        count: storeTrade.count
    }
}

export const objectifySettlingUp = (state: IStore, storeSettlingUp: IStoreSettlingUp): ISettlingUp => {
    if (!storeSettlingUp) {
        return null
    }
    const trades = storeSettlingUp.trades ? storeSettlingUp.trades.map(storeTrade => objectifyTrade(state, storeTrade)) : []
    return {
        trades,
        date: storeSettlingUp.date
    }
}

export const objectifyTrip = (state: IStore, storeTrip: IStoreTrip): ITrip => {
    if (!storeTrip) {
        return null
    }
    const people = storeTrip.people ? storeTrip.people.map(id => state.people[id]) : null
    const payments = storeTrip.payments ? storeTrip.payments.map(id => state.payments[id]) : null
    const transfers = storeTrip.transfers ? storeTrip.transfers.map(id => state.transfers[id]) : null
    return {
        tripId: storeTrip.tripId,
        name: storeTrip.name,
        people,
        payments,
        transfers,
        settlingUp: objectifySettlingUp(state, storeTrip.settlingUp)
    }
}
