import {ITransfer} from './transfers';
/**
 * Путешествие.
 *
 * tripId Идентификатор путешествия из БД.
 * name Наименование.
 * people Участники путешествия.
 * payments Счета (массив идентификаторов).
 * transfers Расчёты (массив идентификаторов)
 */
export interface ITrip {
    tripId: string,
    name?: string,
    people: string[],
    payments: string[],
    transfers: string[]
}

/**
 * Пэйлоад на создание нового путешествия.
 *
 * trip - Новое путешествие.
 */
export interface IPayloadAddTrip {
    trip: ITrip
}