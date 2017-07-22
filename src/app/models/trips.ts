import {IStorable} from './common'

/**
 * Путешественник.
 *
 * personId Идентификатор путешественника (сквозная нумерация).
 * name Имя путешественника.
 */
export interface IPerson {
    personId?: string,
    name: string
}

/**
 * Путешествие.
 *
 * name Наименование.
 * people Участники путешествия.
 * payments Счета (массив идентификаторов).
 */
export interface ITrip {
    tripId?: string,
    name: string,
    people?: IStorable<IPerson>,
    payments?: string[]
}

/**
 * Пэйлоад на создание нового путешествия.
 *
 * trip - Новое путешествие.
 */
export interface IPayloadAddTrip {
    trip: ITrip
}