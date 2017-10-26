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
        settlingUp: objectifySettlingUp(state, storeTrip.settlingUp),
        date: storeTrip.date
    }
}

export const storifyTrade = (trade: ITrade): IStoreTrade => {
    if (!trade) {
        return null
    }
    return {
        id: trade.id,
        fromPerson: trade.fromPerson.id,
        toPerson: trade.toPerson.id,
        count: trade.count
    }
}

export const storifySettlingUp = (settlingUp: ISettlingUp): IStoreSettlingUp => {
    if (!settlingUp) {
        return null
    }
    const trades = settlingUp.trades ? settlingUp.trades.map(trade => storifyTrade(trade)) : []
    return {
        trades,
        date: settlingUp.date
    }
}

export const storifyTrip = (trip: ITrip): IStoreTrip => {
    if (!trip) {
        return null
    }
    const people = trip.people ? trip.people.map(person => person.id) : null
    const payments = trip.payments ? trip.payments.map(payment => payment.paymentId) : null
    const transfers = trip.transfers ? trip.transfers.map(transfer => transfer.id) : null
    return {
        tripId: trip.tripId,
        name: trip.name,
        people,
        payments,
        transfers,
        settlingUp: storifySettlingUp(trip.settlingUp),
        date: trip.date
    }
}