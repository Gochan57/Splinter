import {
    ADD_PERSON,
    ADD_TRIP,
    SETTLE_UP
} from 'app/constants'
import {
    IAction,
    IStorable,
    IStore
} from 'app/models/common'
import {
    IPayloadAddTrip,
    IPayloadSettleUpTrip,
    IStoreTrip,
    ITrip
} from 'app/models/trips'
import {extendConfigurationFile} from 'tslint/lib/configuration';
import {ITransfer} from '../models/transfers';

export const tripActions = {
    addTrip,
    settleUp,
}


// TODO Переделать на асинхронные экшны
/**
 * Создание нового путешествие.
 *
 * @param {string} name - Название.
 * @param {string[]} people - Участники путешествия.
 */
export function addTrip(name: string, people: string[]) {
    return (dispatch, getState: () => IStore) => {
        // Записываем путешествие в базу
        tempPromise('4').then((tripId: string) => {
            // Записываем людей в базу
            let promises = people.map((personName: string, index: number) => {
                return new Promise((resolve, reject) => {
                    tempPromise((10 + index).toString()).then((personId: string) => {
                        // Добавляем новых людей в хранилище.
                        dispatch({
                            type: ADD_PERSON,
                            payload: {person: {
                                personId,
                                name: personName
                            }}
                        })
                        resolve(personId)
                    })
                })
            })
            Promise.all(promises).then((personIds: string[]) => {
                // Добавляем новое путешествие в хранилище.
                const trip: IStoreTrip = {tripId, name, people: personIds, payments: [], transfers: []}
                const action: IAction<IPayloadAddTrip> = {
                    type: ADD_TRIP,
                    payload: {trip}
                }
                dispatch(action)
            })
        })

    }
}

/**
 * Расчет путешествия.
 *
 * @param tripId - Идентификатор путешествия.
 */
export function settleUp(tripId: string) {
    // FIXME
    return (dispatch, getState: () => IStore) => {
        const action: IAction<IPayloadSettleUpTrip> = {type: SETTLE_UP, payload: {tripId, settlingUp: null}}
        dispatch(action)
    }
}

/**
 * Функция для тестирования поведения системы при задержках вызовов.
 * Например, пока нет базы, можно вместо вызова метода сохранения в базу
 * вызвать этот метод, передав в него данные, которые вернулись бы из базы.
 * Метод вернет промис с задержкой в полсекунды.
 *
 * @param data - Данные, которые вернулись бы из реального вызова метода.
 */
function tempPromise(data: any) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data)
        }, 500)
    })
}