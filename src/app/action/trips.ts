import {
    ADD_PERSON,
    ADD_TRIP,
    SETTLE_UP,
    UPDATE_PERSON
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
import {IPerson} from '../models/people';
import {storifyTrip} from '../utils/objectify';

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

// TODO Переделать на асинхронные экшны
/**
 * Редактирование существующего путешествия.
 *
 * @param {string} name - Название.
 * @param {IPerson[]} people - Участники путешествия.
 */
export function updateTrip(trip: ITrip) {
    return (dispatch, getState: () => IStore) => {
        // Записываем людей в базу
        let promises = trip.people.map((person: IPerson, index: number) => {
            if(person.personId === 'NEW_PERSON') {
                // Записываем в базу нового человека
                return new Promise((resolve, reject) => {
                    tempPromise((10 + index).toString()).then((personId: string) => {
                        // Добавляем новых людей в хранилище.
                        person.personId = personId
                        dispatch({
                            type: ADD_PERSON,
                            payload: {
                                person: {
                                    personId,
                                    name: person.name
                                }
                            }
                        })
                        resolve(personId)
                    })
                })
            }
            else {
                // Редактируем существующего человека
                return new Promise((resolve, reject) => {
                    tempPromise(person.personId).then((personId: string) => {
                        // Обновляем данные о человеке в хранилище.
                        dispatch({
                            type: UPDATE_PERSON,
                            payload: {
                                person: {
                                    personId,
                                    name: person.name
                                }
                            }
                        })
                        resolve(personId)
                    })
                })
            }
        })
        Promise.all(promises).then((personIds: string[]) => {
            // Добавляем новое путешествие в хранилище.
            const action: IAction<IPayloadAddTrip> = {
                type: ADD_TRIP,
                payload: {trip: storifyTrip(trip)}
            }
            dispatch(action)
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