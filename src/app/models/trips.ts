import {
    ISettlingUp,
    IStoreSettlingUp,
    ITransfer,
} from './transfers';
import {IPerson} from './people';
import {IPayment} from './payments';

export interface ITripActions {
    setCurrentTrip: (trip: IStoreTrip) => void,
    addTrip: (name: string, people: string[]) => void,
    settleUp: (id: string) => void
}

/**
 * Путешествие.
 *
 * id Идентификатор путешествия из БД.
 * name Наименование.
 * people Участники путешествия.
 * payments Счета (массив идентификаторов).
 * transfers Расчёты (массив идентификаторов)
 * settlingUp - расчет путешествия.
 */
export interface ITrip {
    id: string,
    name?: string,
    people: IPerson[],
    payments: IPayment[],
    transfers: ITransfer[],
    settlingUp?: ISettlingUp,
    date: Date
}

/**
 * Путешествие (для стора).
 *
 * id Идентификатор путешествия из БД.
 * name Наименование.
 * people Участники путешествия.
 * payments Счета (массив идентификаторов).
 * transfers Расчёты (массив идентификаторов)
 * settlingUp - расчет путешествия.
 */
export interface IStoreTrip {
    id: string,
    name?: string,
    people: string[],
    payments: string[],
    transfers: string[],
    settlingUp?: IStoreSettlingUp,
    date: Date
}

export const defaultTrip: IStoreTrip = {
    id: null,
    people: [],
    payments: [],
    transfers: [],
    date: null,
}

/**
 * Пэйлоад на задание текущего путешествия.
 *
 * trip - Путешествие.
 */
export interface IPayloadSetCurrentTrip {
    trip: IStoreTrip
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