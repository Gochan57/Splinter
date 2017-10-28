import {IPerson} from './people'

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
    date: Date
}

/**
 * Расчет путешествия
 *
 * trades - кто, кому и сколько должен выплатить.
 * date - дата расчета.
 */
export interface ISettlingUp {
    trades: ITrade[],
    date: Date
}

/**
 * Расчет путешествия (для стора)
 *
 * trades - кто, кому и сколько должен выплатить.
 * date - дата расчета.
 */
export interface IStoreSettlingUp {
    trades: IStoreTrade[],
    date: Date
}

export interface IPersonBalance {
    person: IPerson,
    balance: number
}
