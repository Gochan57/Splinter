import {
    ADD_PERSON,
    ADD_TRIP
} from 'app/constants'
import {
    IAction,
    IStorable,
    IStore
} from 'app/models/common'
import {
    IPayloadAddTrip,
    ITrip
} from 'app/models/trips'
import {
    IPayloadAddPerson,
} from 'app/models/people'
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
                        const action: IAction<IPayloadAddPerson> = {
                            type: ADD_PERSON,
                            payload: {person: {
                                personId,
                                name: personName
                            }}
                        }
                        dispatch(action)
                        resolve(personId)
                    })
                })
            })
            Promise.all(promises).then((personIds: string[]) => {
                // Добавляем новое путешествие в хранилище.
                const trip: ITrip = {tripId, name, people: personIds, payments: [], transfers: []}
                const action: IAction<IPayloadAddTrip> = {
                    type: ADD_TRIP,
                    payload: {trip}
                }
                dispatch(action)
            })
        })

    }
}

export function settleUp(tripId: string) {
    return (dispatch, getState: () => IStore) => {
        dispatch({type: 'SETTLE_UP', payload: {}})
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