import {
    IStore
} from 'app/models/common'
import {
    IStoreTrip,
    ITrip,
} from 'app/models/trips'
import {IPerson} from '../models/people';
import {storify} from '../utils/objectify';
import * as tripActions from 'app/action/trips'

// TODO Переделать на асинхронные экшны
/**
 * Создание нового путешествие.
 *
 * @param {string} name - Название.
 * @param {string[]} people - Участники путешествия.
 */
export function addTrip (name: string, people: string[]) {
    return (dispatch, getState: () => IStore) => {
        // Записываем путешествие в базу
        tempPromise('4').then((tripId: string) => {
            // Записываем людей в базу
            let promises = people.map((personName: string, index: number) => {
                return new Promise((resolve, reject) => {
                    tempPromise((10 + index).toString()).then((personId: string) => {
                        // Добавляем новых людей в хранилище.
                        dispatch(tripActions.addPerson({
                            id: personId,
                            name: personName
                        }))
                        resolve(personId)
                    })
                })
            })
            Promise.all(promises).then((personIds: string[]) => {
                // Добавляем новое путешествие в хранилище.
                const trip: IStoreTrip = {
                    id: tripId,
                    name,
                    people: personIds,
                    payments: [],
                    transfers: [],
                    date: new Date()
                }
                dispatch(tripActions.addTrip(trip))
            })
        })

    }
}

/**
 * Задать текущее путешествие.
 *
 * @param trip - Путешествие.
 */
export function setCurrentTrip (trip: IStoreTrip) {
    return (dispatch, getState: () => IStore) => {
        dispatch(tripActions.setCurrentTrip(trip))
    }
}

// TODO Переделать на асинхронные экшны
/**
 * Редактирование существующего путешествия.
 *
 * @param {string} name - Название.
 * @param {IPerson[]} people - Участники путешествия.
 */
export function updateTrip (trip: ITrip) {
    return (dispatch, getState: () => IStore) => {
        // Записываем людей в базу
        let promises = trip.people.map((person: IPerson, index: number) => {
            if (person.id === 'NEW_PERSON') {
                // Записываем в базу нового человека
                return new Promise((resolve, reject) => {
                    tempPromise((10 + index).toString()).then((personId: string) => {
                        // Добавляем новых людей в хранилище.
                        person.id = personId
                        dispatch(tripActions.addPerson({
                            id: personId,
                            name: person.name
                        }))
                        resolve(personId)
                    })
                })
            }
            else {
                // Редактируем существующего человека
                return new Promise((resolve, reject) => {
                    tempPromise(person.id).then((personId: string) => {
                        // Обновляем данные о человеке в хранилище.
                        dispatch(tripActions.updatePerson({
                            id: personId,
                            name: person.name
                        }))
                        resolve(personId)
                    })
                })
            }
        })
        Promise.all(promises).then((personIds: string[]) => {
            // Добавляем новое путешествие в хранилище.
            dispatch(tripActions.addTrip(storify.trip(trip)))
        })
    }
}

/**
 * Расчет путешествия.
 *
 * @param tripId - Идентификатор путешествия.
 */
export function settleUp (tripId: string) {
    // FIXME
    return (dispatch, getState: () => IStore) => {
        dispatch(tripActions.settleUp(tripId, null))
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
function tempPromise (data: any) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data)
        }, 500)
    })
}

export interface ITripThunks {
    addTrip: typeof addTrip,
    setCurrentTrip: typeof setCurrentTrip,
    updateTrip: typeof updateTrip,
    settleUp: typeof settleUp,
}