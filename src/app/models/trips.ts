import {
    ISettlingUp,
    IStoreSettlingUp,
    ITransfer,
} from './transfers';
import {IPerson} from './people';
import {IPayment} from './payments';

export interface ITripActions {
    addTrip: (name: string, people: string[]) => void,
    settleUp: (tripId: string) => void
}

/**
 * Путешествие.
 *
 * tripId Идентификатор путешествия из БД.
 * name Наименование.
 * people Участники путешествия.
 * payments Счета (массив идентификаторов).
 * transfers Расчёты (массив идентификаторов)
 * settlingUp - расчет путешествия.
 */
export interface ITrip {
    tripId: string,
    name?: string,
    people: IPerson[],
    payments: IPayment[],
    transfers: ITransfer[],
    settlingUp?: ISettlingUp
}

/**
 * Путешествие (для стора).
 *
 * tripId Идентификатор путешествия из БД.
 * name Наименование.
 * people Участники путешествия.
 * payments Счета (массив идентификаторов).
 * transfers Расчёты (массив идентификаторов)
 * settlingUp - расчет путешествия.
 */
export interface IStoreTrip {
    tripId: string,
    name?: string,
    people: string[],
    payments: string[],
    transfers: string[],
    settlingUp?: IStoreSettlingUp
}

/**
 * Пэйлоад на создание нового путешествия.
 *
 * trip - Новое путешествие.
 */
export interface IPayloadAddTrip {
    trip: IStoreTrip
}

/**
 * Пэйлоад на расчет путешествия.
 *
 * tripId - Идентификатор путешествия.
 * settlingUp - Расчет путешествия.
 */
export interface IPayloadSettleUpTrip {
    tripId: string,
    settlingUp: IStoreSettlingUp
}