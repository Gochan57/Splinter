import {IPerson} from './people'

export interface ITransferActions {
    addTransferChain: (tripId: string, trades: ITrade[]) => void
}

/**
 * id Идентификатор в БД.
 * fromPerson Кто передал деньги.
 * toPerson Кому передал деньги.
 * count Количество денег.
 */
export interface ITrade {
    id?: string,
    fromPerson: IPerson,
    toPerson: IPerson,
    count: number
}

/**
 * id Идентификатор в БД.
 * fromPerson Идентификатор, кто передал деньги.
 * toPerson Идентификатор, кому передал деньги.
 * count Количество денег.
 */
export interface IStoreTrade {
    id?: string,
    fromPerson: string,
    toPerson: string,
    count: number
}

/**
 * Несколько передач денег, совершенных одновременно.
 *
 * id Идентификатор в БД.
 * trades Передачи денег.
 * date Дата (в формате ISO-8601)
 */
export interface ITransfer {
    id: string,
    trades: ITrade[],
    date: string
}

/**
 * Расчет путешествия
 *
 * trades - кто, кому и сколько должен выплатить.
 * date - дата расчета.
 */
export interface ISettlingUp {
    trades: ITrade[],
    date: string
}

/**
 * Расчет путешествия (для стора)
 *
 * trades - кто, кому и сколько должен выплатить.
 * date - дата расчета.
 */
export interface IStoreSettlingUp {
    trades: IStoreTrade[],
    date: string
}

export interface IPersonBalance {
    person: IPerson,
    balance: number
}

/**
 * Пэйлоад на добавление новой цепочки трансфера денег.
 *
 * tripId - Идентификатор путешествия
 * transfer - Новая цепочка трансферов.
 */
export interface IPayloadAddTransfer {
    tripId: string
    transfer: ITransfer
}