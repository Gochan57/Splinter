import {IPerson} from './people'

/**
 * id Идентификатор в БД.
 * fromPerson Кто передал деньги.
 * toPerson Кому передал деньги.
 * count Количество денег.
 */
export interface ITrade {
    id: string,
    fromPerson: IPerson,
    toPerson: IPerson,
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
 * Пэйлоад на добавление новой цепочки трансфера денег.
 *
 * transfer - Новая цепочка трансферов.
 */
export interface IPayloadAddTransfer {
    transfer: ITransfer
}