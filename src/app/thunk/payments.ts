import {
    zeroIfNull
} from 'app/utils/utils'
import {
    IStore
} from 'app/models/common'
import {
    IStoreMember,
    IStorePayment,
    defaultPayment,
} from 'app/models/payments'
import * as _ from 'lodash'
import {ITrip} from '../models/trips';
import {IPerson} from '../models/people';
import * as paymentActions from 'app/action/payments'

/**
 * Начало создания нового счета.
 *
 * @param trip - Путешествия.
 */
export type startCreatingNewPayment = (trip: ITrip) => void
export function startCreatingNewPayment(trip: ITrip) {
    return (dispatch, getState: () => IStore) => {
        // Составляем массив всех участников путешествия
        const members: IStoreMember[] = _.map(trip.people, (person: IPerson) => ({personId: person.id}))
        const payment: IStorePayment = {...defaultPayment, members}
        dispatch(paymentActions.setCurrentPayment(payment))
    }
}

/**
 * Задаем текущий счет.
 *
 * @param payment - Счет.
 */
export function setCurrentPayment(payment: IStorePayment) {
    return (dispatch, getState: () => IStore) => {
        dispatch(paymentActions.setCurrentPayment(payment))
    }
}

/**
 * Начало редактирования счета.
 *
 * @param paymentId - Идентификатор счета.
 */
export function startUpdatingPayment(paymentId: string) {
    return (dispatch, getState: () => IStore) => {
        const payment: IStorePayment = _.cloneDeep(getState().payments.items[paymentId])
        dispatch(paymentActions.setCurrentPayment(payment))
    }
}

/**
 * Изменение названия счета.
 *
 * @param name - Название счета.
 */
export function changePaymentName(name: string) {
    return (dispatch, getState: () => IStore) => {
        dispatch(paymentActions.changePaymentName(name))
    }
}

/**
 * Изменение списка участников счета.
 *
 * @param personIdList Массив id людей, участвующих в счете.
 */
export function setMembersOfPayment(personIdList: string[]) {
    return (dispatch, getState: () => IStore) => {
        // FIXME переделать на получение из трипа
        const payment: IStorePayment = getState().payments.current
        const members: IStoreMember[] = _.filter(payment.members, member => _.some(personIdList, member.personId))
        dispatch(paymentActions.setMembersOfPayment(members))
        // Если выбрано "Платили поровну", то разделим счет на участников счета.
        if (getState().payments.current.spentEqually) {
            dispatch(paymentActions.splitSumByMembers())
        }
    }
}

/**
 * Удаление участника из списка участников.
 *
 * @param personId - Идентификатор удаляемого участника.
 */
export function removeMemberFromPayment(personId: string) {
    return (dispatch, getState: () => IStore) => {
        dispatch(paymentActions.removeMemberFromPayment(personId))
        // Если выбрано "Платили поровну", то разделим счет на оставшихся.
        if (getState().payments.current.spentEqually) {
            dispatch(paymentActions.splitSumByMembers())
        }
    }
}

/**
 * Переключение "Потратили поровну".
 *
 * @param spentEqually - Все потратили поровну?
 */
export function spentEquallySwitched(spentEqually: boolean) {
    return (dispatch, getState: () => IStore) => {
        dispatch(paymentActions.spentEquallySwitched(spentEqually))
        if (spentEqually) {
            // Если переключили на "Потратили поровну", разделим сумму счета по всем участникам
            // Делаем небольшую задержку на случай, если переключили свитчер, не сняв фокус с инпута потраченных денег
            // одного из участников счета, чтобы успело обновиться значение его потраченных денег.
            // setTimeout(() => {dispatch(splitSumByMembers())}, 100)
            setTimeout(() => {dispatch(paymentActions.splitSumByMembers())}, 100)
        }
    }
}

/**
 * Переключение "Платил один".
 *
 * @param paidOne - Платил один?
 */
export function paidOneSwitched(paidOne: boolean) {
    return (dispatch, getState: () => IStore) => {
        dispatch(paymentActions.paidOneSwitched(paidOne))
        if (!paidOne) {
            // Если выключили "Платил один", то снимем галочку с человека, помеченного как платящего за всех.
            dispatch(paymentActions.resetPaidForAll())
        }
    }
}

/**
 * Сбросить всем участникам счета галочку "Платил за всех".
 */
export function resetPaidForAll() {
    return (dispatch, getState: () => IStore) => {
        dispatch(paymentActions.resetPaidForAll())
    }
}

/**
 * Изменение общей суммы счета.
 *
 * param sum - Общая сумма счета.
 */
export function changeSumOnPayment(sum: number) {
    return (dispatch, getState: () => IStore) => {
        dispatch(paymentActions.changeSumOnPayment(sum))
        dispatch(paymentActions.splitSumByMembers(sum))
    }
}

/**
 * Распределение суммы счета по всем участникам счета.
 *
 * param [sum] Сумма счета.
 */
export function splitSumByMembers(sum?: number) {
    return (dispatch, getState: () => IStore) => {
        const payment: IStorePayment = getState().payments.current
        if (payment.members && payment.members.length > 0) {
            const _sum: number = sum || payment.sum
            const spentEach: number = _sum / payment.members.length
            dispatch(paymentActions.splitSumByMembers(spentEach))
        }
    }
}

/**
 * Отметить человека, как оплатившего счет за всех.
 *
 * @param personId - Человек, который оплатил счет.
 */
export function paidForAllChecked(personId: string) {
    return (dispatch, getState: () => IStore) => {
        dispatch (paymentActions.paidForAllChecked(personId))
        dispatch(changePaidToPayForAll(personId))
    }
}

/**
 * Человеку, помеченному как платящего за весь счет, назначить в "потратил" общую сумму счета.
 *
 * @param [personId] - Человек, который оплатил счет.
 */
export function changePaidToPayForAll(personId?: string) {
    return (dispatch, getState: () => IStore) => {
        // считаем сумму потраченных денег
        const members: IStoreMember[] = getState().payments.current.members
        const sumSpent: number = _.reduce(members, (sum: number, member: IStoreMember) => sum + zeroIfNull(member.spent), 0)
        // если personId не передан, можно вычислить его из метки paidForAll у участника счета
        if (!personId) {
            const memberPaidForAll: IStoreMember = _.find(members, (member: IStoreMember) => member.paidForAll)
            if (memberPaidForAll) {
                personId = memberPaidForAll.personId
            }
        }
        if (personId) {
            dispatch(paymentActions.changePaidToPayForAll(personId, sumSpent))
        }
    }
}

/**
 * Изменение потраченных денег у участника счета.
 *
 * @param personId - Идентификатор участника.
 * @param value - Новое количество потраченных денег.
 */
export function changeMemberSpentOnPayment(personId: string, value: number) {
    const spent: number = value
    return (dispatch, getState: () => IStore) => {
        // считаем сумму редактируемого счета
        const payment: IStorePayment = getState().payments.current
        const sum: number = _.reduce(payment.members, (paymentSum: number, member: IStoreMember) => {
            const memberSpent: number = (member.personId === personId ? value : member.spent)
            return paymentSum + memberSpent
        }, 0)
        dispatch(paymentActions.changeMemberSpentOnPayment(personId, spent, sum))
        // если оплачивает один человек, то также изменим ему сумму оплаченных денег
        if (payment.paidOne) {
            dispatch(changePaidToPayForAll())
        }
    }
}

/**
 * Изменение заплаченных денег у участника счета.
 *
 * @param personId - Идентификатор участника.
 * @param paid - Новое количество заплаченных денег.
 */
export function changeMemberPaidOnPayment(personId: string, paid: number) {
    return (dispatch, getState: () => IStore) => {
        dispatch(paymentActions.changeMemberPaidOnPayment(personId, paid))
    }
}

/**
 * Сохранение обновленной информации о счете.
 *
 * @param tripId - Идентификатор путешествия.
 */
export function updatePayment(tripId: string) {
    return (dispatch, getState: () => IStore) => {
        const payment: IStorePayment = getState().payments.current
        // FIXME сохранять счет в базу
        const paymentId: string = payment.id || '4'
        tempPromise(paymentId).then((paymentId: string) => {
            dispatch(paymentActions.updatePayment(tripId, payment))
        })
    }
}

/**
 * Отмена редактирования счета.
 *
 */
export function cancelUpdatingPayment() {
    return (dispatch, getState: () => IStore) => {
        dispatch(paymentActions.cancelUpdatingPayment())
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

export interface IPaymentThunks {
    startCreatingNewPayment: typeof startCreatingNewPayment,
    setCurrentPayment: typeof setCurrentPayment,
    startUpdatingPayment: typeof startUpdatingPayment,
    changePaymentName: typeof changePaymentName,
    setMembersOfPayment: typeof setMembersOfPayment,
    removeMemberFromPayment: typeof removeMemberFromPayment,
    spentEquallySwitched: typeof spentEquallySwitched,
    paidOneSwitched: typeof paidOneSwitched,
    resetPaidForAll: typeof resetPaidForAll,
    changeSumOnPayment: typeof changeSumOnPayment,
    splitSumByMembers: typeof splitSumByMembers,
    paidForAllChecked: typeof paidForAllChecked,
    changePaidToPayForAll: typeof changePaidToPayForAll,
    changeMemberSpentOnPayment: typeof changeMemberSpentOnPayment,
    changeMemberPaidOnPayment: typeof changeMemberPaidOnPayment,
    updatePayment: typeof updatePayment,
    cancelUpdatingPayment: typeof cancelUpdatingPayment,
}
