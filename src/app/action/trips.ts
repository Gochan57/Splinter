import {ADD_TRIP} from 'app/constants'
import {
    IAction,
    IStorable,
    IStore
} from 'app/models/common'
import {
    IPayloadAddTrip,
    IPerson,
    ITrip
} from 'app/models/trips'
import {toObjectWithKeysArray} from '../utils/utils'
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
                return tempPromise((10 + index).toString())
            })
            Promise.all(promises).then((personIds: string[]) => {
                const tripPeopleArr: IPerson[] = people.map((personName: string) => ({name: personName}))
                const tripPeople: IStorable<IPerson> = toObjectWithKeysArray(tripPeopleArr, personIds)
                const trip: ITrip = {
                    tripId,
                    name,
                    people: tripPeople
                }
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