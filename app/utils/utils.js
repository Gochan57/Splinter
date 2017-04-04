/**
 * Переводит объект в массив, добавляя в каждый элемент массива поле со значением ключа в объекте
 * (propName - наименование поля, по умолчанию 'id'):
 *
 * на вход:
 * o = {
 *  1: {name: 'George'},
 *  2: {name: 'Julia'}
 * }
 * propName = 'id'
 *
 * на выходе:
 * [
 *  {id: '1', name: 'George'},
 *  {id: '2', name: 'Julia'},
 * ]
 *
 * @param o Объект, в котором значения всех полей также объекты
 * @param propName = 'id' Наименование поля, которое добавляется в каждый элемент массива,
 * и значением которого будет значение ключа в объекте
 */
export function toArrayWithKeys (o, propName = 'id') {
    if (typeof o !== 'object') {
        logError('Income param is not an object:', o)
        return
    }
    let res = []
    for (let key in o) {
        if (typeof o[key] === 'object') {
            res.push({...o[key], [propName]: key})
        }
        else {
            logError(`Can\'t transform object to array. ${o[key]} is not an object`, o)
        }
    }
    return res;
}

/**
 * Возвращает ключ с максимальным значением.
 *
 * @param o Объект типа
 * {
 *  1: {name: 'George'},
 *  2: {name: 'Julia'}
 * }
 */
export function getMaxId (o) {
    return Math.max.apply(Math, Object.keys(o))
}

/**
 * Логирует ошибку.
 *
 * @param error Текст ошибки.
 */
export function logError (error) {
    console.log(error)
}