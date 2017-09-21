import {omit} from 'lodash'
import {IStorable} from 'app/models/common'
import {
    IPersonBalance,
    ITrade,
    ITransfer
} from '../models/transfers';

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
export function toArrayWithKeys<T> (o, propName: string = 'id'): T[] {
    if (typeof o !== 'object') {
        logError('Income param is not an object:', o)
        return
    }
    let res: T[] = []
    for (let key in o) {
        if (o.hasOwnProperty(key)) {
            if (typeof o[key] === 'object') {
                res.push({
                    ...o[key],
                    [propName]: key
                })
            }
            else {
                logError(`Can\'t transform object to array. ${o[key]} is not an object`, o)
            }
        }
    }
    return res
}

/**
 * Переводит массив в объект с ключами, соответствующими полю propName в элементах массива.
 *
 * @param arr Массив.
 * @param propName Имя поля, значение которого станут ключами в новом объекте.
 */
export function toObjectWithPropName (arr: object[], propName: string = 'id') {
    let res = {}
    if (!arr) logError('toObjectWithPropName >>> массив не существует')
    arr.forEach((elem: object) => {
        const key = elem[propName]
        if (!key) {
            logError('toObjectWithKeys >>> element', elem, `has no property ${propName}`)
        }
        res[key] = omit(elem, key)
    })
    return res
}

/**
 * Переводит массив в объект с ключами из массива keysArr.
 * Длины переданных массивов должны быть обязательно равны.
 *
 * @param arr Массив.
 * @param keysArr Массив ключей в новом объекте.
 */
export function toObjectWithKeysArray (arr: any[], keysArr: string[]) {
    let res = {}
    if (!arr) logError('toObjectWithKeysArray >>> массив не передан')
    if (!keysArr) logError('toObjectWithKeysArray >>> массив ключей не передан')
    if (arr.length !== keysArr.length) logError('toObjectWithKeysArray >>> длины массивов не совпадают')
    for (let i = 0; i < arr.length; i++) {
        if (!keysArr[i]) logError('toObjectWithKeysArray >>> массив ключей содержит пустой элемент', keysArr)
        res[keysArr[i]] = arr[i]
    }
    return res
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
 * Преобразует строку в число.
 * @param value Строка.
 */
export function toNumber (value: string): number {
    if (!value) return 0
    if (typeof value === 'string') {
        value = value.replace(',', '.')
    }
    return parseFloat(value || '0')
}

/**
 * null -> 0
 */
export function zeroIfNull (value: number): number {
    return value ? value : 0
}

/**
 * Преобразует строку в число,
 * но если был передан null или undefined, вернет null или undefinde.
 * @param value Строка.
 */
export function toNumberNullable (value: string): number {
    if (value === null || value === undefined) {
        return null
    }
    return toNumber(value)
}

/**
 * Округляет число до нужно количества знаков
 *
 * @param value Число.
 * @param n Количсетво знаков.
 */
export function round (value, n: number): number {
    n = n || 0
    return Math.round(toNumber(value) * Math.pow(10, n)) / Math.pow(10, n)
}

/**
 * Форматирование числового значения для отображения в текстовом поле.
 */
export function formatValue (value: number): string {
    if (value === undefined) return undefined
    if (value === null) return null
    return round(value, 2).toString()
}

/**
 * Логирует ошибку.
 *
 * @param params Все выведется в консоль.
 */
export function logError (...params) {
    console.log(params)
}

export function settleUp (balances: IPersonBalance[]): ITrade[] {
    let result: ITrade[]
    let plus: IPersonBalance[]
    let minus: IPersonBalance[]
    let i, j: number

    const person1 = {
        personId: '1',
        name: 'Юля1'
    }
    const person2 = {
        personId: '2',
        name: 'Юля2'
    }
    const person3 = {
        personId: '3',
        name: 'Юля3'
    }

    balances.forEach(b => {
        if (b.balance > 0) {
            plus.push(b)
        }
        if (b.balance < 0) {
            minus.push(b)
        }
    })

    for (i = 1; i < plus.length; i++) {
    }

    return [
        {
            fromPerson: person2,
            toPerson: person1,
            count: 100
        },
        {
            fromPerson: person3,
            toPerson: person1,
            count: 100
        },
    ]
    // return result
}