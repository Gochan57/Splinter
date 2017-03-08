/**
 * Переводит объект в массив:
 *
 * на вход:
 * {
 *  1: {
 *      name: 'George'
 *  },
 *  2: {
 *      name: 'Julia'
 *  }
 * }
 *
 * на выходе:
 * [
 *  {id: '1', name: 'George'},
 *  {id: '2', name: 'Julia'},
 * ]
 *
 * @param o Объект, в котором значения всех полей также объекты
 */
export function toArrayWithIds (o) {
    let res = []
    for (let key in o) {
        console.log(typeof o[key])
        if (typeof o[key] === 'object') {
            res.push({...o[key], id: key})
        }
    }
    return res;
}