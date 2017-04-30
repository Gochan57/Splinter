import {ADD_TRIP} from '../constants'
// TODO Переделать на асинхронные экшны
/**
 * Создание нового путешествие.
 *
 * @param {string} name - Название.
 * @param {string[]} members - Участники.
 */
export function addTrip(name, members) {
    return {
        type: ADD_TRIP,
        payload: {
            name
        }
    }
}
