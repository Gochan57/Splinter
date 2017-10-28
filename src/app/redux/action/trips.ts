import {
    IStoreTrip,
} from 'app/models/trips'
import {IPerson} from '../../models/people';
import {
    ISettlingUp,
    IStoreSettlingUp
} from '../../models/transfers';

// TODO Переделать на асинхронные экшны
/**
 * Создание нового путешествие.
 *
 * @param {string} name - Название.
 * @param {string[]} people - Участники путешествия.
 */
export function addTrip (trip: IStoreTrip): ITripAction {
    return {
        type: 'ADD_TRIP',
        payload: {trip}
    }
}

/**
 * Редактирование существующего путешествия.
 *
 * @param trip - Путешествие.
 */
export function updateTrip (trip: IStoreTrip): ITripAction {
    return {
        type: 'ADD_TRIP',
        payload: {trip}
    }
}

/**
 * Добавить человека в хранилище.
 * @param person - Путешественник.
 */
export function addPerson (person: IPerson): ITripAction {
    return {
        type: 'ADD_PERSON',
        payload: {
            person
        }
    }
}

/**
 * Добавить человека в хранилище.
 * @param person - Путешественник.
 */
export function updatePerson (person: IPerson): ITripAction {
    return {
        type: 'UPDATE_PERSON',
        payload: {
            person
        }
    }
}
/**
 * Задать текущее путешествие.
 *
 * @param trip - Путешествие.
 */
export function setCurrentTrip (trip: IStoreTrip): ITripAction {
    return {
        type: 'SET_CURRENT_TRIP',
        payload: {trip}
    }
}

/**
 * Расчет путешествия.
 *
 * @param tripId - Идентификатор путешествия.
 */
export function settleUp (tripId: string, settlingUp: ISettlingUp): ITripAction {
    //FIXME
    return {
        type: 'SETTLE_UP',
        payload: {
            tripId,
            settlingUp: null
        }
    }
}

export type ITripAction =
    {
        type: 'ADD_TRIP',
        payload: {
            trip: IStoreTrip
        }
    } |
    {
        type: 'UPDATE_TRIP',
        payload: {
            trip: IStoreTrip
        }
    } |
    {
        type: 'ADD_PERSON',
        payload: {
            person: IPerson
        }
    } |
    {
        type: 'UPDATE_PERSON',
        payload: {
            person: IPerson
        }
    } |
    {
        type: 'SET_CURRENT_TRIP',
        payload: {
            trip: IStoreTrip
        }
    } |
    {
        type: 'SETTLE_UP',
        payload: {
            tripId: string,
            settlingUp: IStoreSettlingUp
        }
    }