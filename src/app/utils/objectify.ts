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
import {
    IMember,
    IPayment,
    IStoreMember,
    IStorePayment
} from '../models/payments';

export namespace objectify {

    export const member = (state: IStore, storeMember: IStoreMember): IMember => {
        if (!storeMember) {
            return null
        }
        return {
            person: state.people[storeMember.personId],
            spent: storeMember.spent,
            paid: storeMember.paid,
            paidForAll: storeMember.paidForAll
        }
    }

    export const payment = (state: IStore, storePayment: IStorePayment): IPayment => {
        if (!storePayment) {
            return null
        }
        return {
            id: storePayment.id,
            name: storePayment.name,
            date: storePayment.date,
            members: storePayment.members.map(member => objectify.member(state, member)),
            spentEqually: storePayment.spentEqually,
            paidOne: storePayment.paidOne,
            sum: storePayment.sum,
        }
    }

    export const trade = (state: IStore, storeTrade: IStoreTrade): ITrade => {
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

    export const settlingUp = (state: IStore, storeSettlingUp: IStoreSettlingUp): ISettlingUp => {
        if (!storeSettlingUp) {
            return null
        }
        const trades = storeSettlingUp.trades ? storeSettlingUp.trades.map(storeTrade => objectify.trade(state, storeTrade)) : []
        return {
            trades,
            date: storeSettlingUp.date
        }
    }

    export const trip = (state: IStore, storeTrip: IStoreTrip): ITrip => {
        if (!storeTrip) {
            return null
        }
        const people = storeTrip.people ? storeTrip.people.map(id => state.people[id]) : null
        const payments = storeTrip.payments ? storeTrip.payments.map(id => objectify.payment(state, state.payments.items[id])) : null
        const transfers = storeTrip.transfers ? storeTrip.transfers.map(id => state.transfers[id]) : null
        return {
            id: storeTrip.id,
            name: storeTrip.name,
            people,
            payments,
            transfers,
            settlingUp: objectify.settlingUp(state, storeTrip.settlingUp),
            date: storeTrip.date
        }
    }
}

export namespace storify {

    export const member = (member: IMember): IStoreMember => {
        if (!member) {
            return null
        }
        return {
            personId: member.person.id,
            spent: member.spent,
            paid: member.paid,
            paidForAll: member.paidForAll,
        }
    }

    export const payment = (payment: IPayment): IStorePayment => {
        if (!payment) {
            return null
        }
        return {
            id: payment.id,
            name: payment.name,
            date: payment.date,
            members: payment.members.map(member => storify.member(member)),
            spentEqually: payment.spentEqually,
            paidOne: payment.paidOne,
            sum: payment.sum,
        }
    }

    export const trade = (trade: ITrade): IStoreTrade => {
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

    export const settlingUp = (settlingUp: ISettlingUp): IStoreSettlingUp => {
        if (!settlingUp) {
            return null
        }
        const trades = settlingUp.trades ? settlingUp.trades.map(trade => storify.trade(trade)) : []
        return {
            trades,
            date: settlingUp.date
        }
    }

    export const trip = (trip: ITrip): IStoreTrip => {
        if (!trip) {
            return null
        }
        const people = trip.people ? trip.people.map(person => person.id) : null
        const payments = trip.payments ? trip.payments.map(payment => payment.id) : null
        const transfers = trip.transfers ? trip.transfers.map(transfer => transfer.id) : null
        return {
            id: trip.id,
            name: trip.name,
            people,
            payments,
            transfers,
            settlingUp: storify.settlingUp(trip.settlingUp),
            date: trip.date
        }
    }
}