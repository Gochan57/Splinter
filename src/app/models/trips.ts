/**
 * Путешествие.
 *
 * name Наименование.
 * people Участники путешествия.
 * payments Счета (массив идентификаторов).
 */
export interface ITrip {
    tripId: string,
    name?: string,
    people: string[],
    payments: string[]
}

/**
 * Пэйлоад на создание нового путешествия.
 *
 * trip - Новое путешествие.
 */
export interface IPayloadAddTrip {
    trip: ITrip
}