import {
    START_UPDATING_PAYMENT,
    CHANGE_PAYMENT_NAME,
    SET_MEMBERS_OF_PAYMENT,
    REMOVE_MEMBER_FROM_PAYMENT,
    SPENT_EQUALLY_SWITCHED,
    PAID_ONE_SWITCHED,
    RESET_PAID_FOR_ALL,
    CHANGE_SUM_ON_PAYMENT,
    SPLIT_SUM_BY_MEMBERS,
    PAID_FOR_ALL_CHECKED,
    CHANGE_PAID_TO_PAY_FOR_ALL,
    CHANGE_MEMBER_SPENT_ON_PAYMENT,
    CHANGE_MEMBER_PAID_ON_PAYMENT,
    UPDATE_PAYMENT,
    CANCEL_UPDATING_PAYMENT,
    TEMPORARY_ID,
} from '../constants'
import {toArrayWithKeys, toNumber, logError} from 'app/utils/utils'
import {
    IStorable,
    IAction,
    IStore
} from 'app/models/common'
import {
    IPayloadStartUpdatingPayment,
    IPayloadChangePaymentName,
    IPayloadSetMembersOfPayment,
    IPayloadRemoveMemberFromPayment,
    IPayloadSpentEquallySwitched,
    IPayloadPaidOneSwitched,
    IPayloadChangeSumOnPayment,
    IPayloadSplitSumByMembers,
    IPayloadPaidForAllChecked,
    IPayloadChangePaidToPayForAll,
    IPayloadСhangeMemberSpentOnPayment,
    IPayloadChangeMemberPaidOnPayment,
    IPayloadUpdatePayment,
    IMember,
    IPayment,
} from 'app/models/payments'
import {IPerson} from 'app/models/trips'
import {find, map, reduce} from 'lodash'

/**
 * Начало создания нового счета.
 *
 * @param tripId - Идентификатор путешествия.
 */
export function startCreatingNewPayment(tripId: string) {
    return (dispatch, getState: () => IStore) => {
        // Составляем массив всех участников путешествия
        const people: IStorable<IPerson> = getState().trips[tripId].people
        const members: IMember[] = people && map(Object.keys(people), (personId: string) => ({personId}))
        const action: IAction<IPayloadStartUpdatingPayment> = {
            type: START_UPDATING_PAYMENT,
            payload: {members}
        }
        dispatch(action)
    }
}

/**
 * Начало редактирования счета.
 *
 * @param paymentId - Идентификатор счета.
 */
export function startUpdatingPayment(paymentId: string) {
    return (dispatch, getState: () => IStore) => {
        const action: IAction<IPayloadStartUpdatingPayment> = {
            type: START_UPDATING_PAYMENT,
            payload: {paymentId}
        }
        dispatch(action)
    }
}

/**
 * Изменение названия счета.
 *
 * @param name - Название счета.
 */
export function changePaymentName(name: string) {
    return (dispatch, getState: () => IStore) => {
        const action: IAction<IPayloadChangePaymentName> = {
            type: CHANGE_PAYMENT_NAME,
            payload: {name}
        }
        dispatch(action)
    }
}

/**
 * Изменение списка участников счета.
 *
 * @param personIdList Массив id людей, участвующих в счете.
 */
export function setMembersOfPayment(personIdList: string[]) {
    return (dispatch, getState: () => IStore) => {
        const action: IAction<IPayloadSetMembersOfPayment> = {
            type: SET_MEMBERS_OF_PAYMENT,
            payload: {personIdList}
        }
        dispatch(action)
        // Если выбрано "Платили поровну", то разделим счет на участников счета.
        if (getState().payments[TEMPORARY_ID].spentEqually) {
            dispatch(splitSumByMembers())
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
        const action: IAction<IPayloadRemoveMemberFromPayment> = {
            type: REMOVE_MEMBER_FROM_PAYMENT,
            payload: {personId}
        }
        dispatch(action)
        // Если выбрано "Платили поровну", то разделим счет на оставшихся.
        if (getState().payments[TEMPORARY_ID].spentEqually) {
            dispatch(splitSumByMembers())
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
        const action: IAction<IPayloadSpentEquallySwitched> = {
            type: SPENT_EQUALLY_SWITCHED,
            payload: {spentEqually}
        }
        dispatch(action)
        if (spentEqually) {
            // Если переключили на "Потратили поровну", разделим сумму счета по всем участникам
            // Делаем небольшую задержку на случай, если переключили свитчер, не сняв фокус с инпута потраченных денег
            // одного из участников счета, чтобы успело обновиться значение его потраченных денег.
            // setTimeout(() => {dispatch(splitSumByMembers())}, 100)
            setTimeout(() => {dispatch(splitSumByMembers())}, 100)
        }
    }
}

/**
 * Переключение "Платил один".
 *
 * @param paidOne - Платил один?
 */
export function paidOneSwitched(paidOne: boolean) {
    return dispatch => {
        const action: IAction<IPayloadPaidOneSwitched> = {
            type: PAID_ONE_SWITCHED,
            payload: {paidOne}
        }
        dispatch(action)
        if (!paidOne) {
            // Если выключили "Платил один", то снимем галочку с человека, помеченного как платящего за всех.
            dispatch(resetPaidForAll())
        }
    }
}

/**
 * Сбросить всем участникам счета галочку "Платил за всех".
 */
export function resetPaidForAll(): IAction<null> {
    return {
        type: RESET_PAID_FOR_ALL
    }
}

/**
 * Изменение общей суммы счета.
 *
 * param sum - Общая сумма счета.
 */
export function changeSumOnPayment(sum: number) {
    return (dispatch) => {
        const action: IAction<IPayloadChangeSumOnPayment> = {
            type: CHANGE_SUM_ON_PAYMENT,
            payload: {sum}
        }
        dispatch(action)
        dispatch(splitSumByMembers(sum))
    }
}

/**
 * Распределение суммы счета по всем участникам счета.
 *
 * param [sum] Сумма счета.
 */
export function splitSumByMembers(sum?: number) {
    return (dispatch, getState: () => IStore) => {
        const payment: IPayment = getState().payments[TEMPORARY_ID]
        if (payment.members && payment.members.length > 0) {
            const _sum: number = sum || payment.sum
            const spentEach: number = _sum / payment.members.length
            const action: IAction<IPayloadSplitSumByMembers> = {
                type: SPLIT_SUM_BY_MEMBERS,
                payload: {spentEach}
            }
            dispatch(action)
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
        const action: IAction<IPayloadPaidForAllChecked> = {
            type: PAID_FOR_ALL_CHECKED,
            payload: {personId}
        }
        dispatch (action)
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
        const members: IMember[] = getState().payments[TEMPORARY_ID].members
        const sumSpent: number = reduce(members, (sum, member) => sum + toNumber(member.spent), 0)
        // если personId не передан, можно вычислить его из метки paidForAll у участника счета
        if (!personId) {
            personId = find(members, member => member.paidForAll).personId
        }
        const action: IAction<IPayloadChangePaidToPayForAll> = {
            type: CHANGE_PAID_TO_PAY_FOR_ALL,
            payload: {personId, sumSpent}
        }
        dispatch (action)
    }
}

/**
 * Изменение потраченных денег у участника счета.
 *
 * @param personId - Идентификатор участника.
 * @param value - Новое количество потраченных денег.
 */
export function changeMemberSpentOnPayment(personId: string, value: number) {
    const spent: number = toNumber(value)
    return (dispatch, getState: () => IStore) => {
        // считаем сумму редактируемого счета
        const payment: IPayment = getState().payments[TEMPORARY_ID]
        const sum: number = reduce(payment.members, (paymentSum: number, member: IMember) => {
            const memberSpent: number = (member.personId === personId ? toNumber(value) : toNumber(member.spent))
            return paymentSum + memberSpent
        }, 0)
        const action: IAction<IPayloadСhangeMemberSpentOnPayment> = {
            type: CHANGE_MEMBER_SPENT_ON_PAYMENT,
            payload: {personId, spent, sum}
        }
        dispatch(action)
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
 * @param value - Новое количество заплаченных денег.
 */
export function changeMemberPaidOnPayment(personId: string, value: number) {
    const paid: number = toNumber(value)
    return (dispatch, getState: () => IStore) => {
        const action: IAction<IPayloadChangeMemberPaidOnPayment> = {
            type: CHANGE_MEMBER_PAID_ON_PAYMENT,
            payload: {personId, paid}
        }
        dispatch(action)
    }
}

/**
 * Сохранение обновленной информации о счете.
 *
 * @param tripId - Идентификатор путешествия.
 */
export function updatePayment(tripId: string) {
    return (dispatch, getState: () => IStorable<IPayment>) => {
        const payment: IPayment = getState().payments[TEMPORARY_ID]
        // FIXME сохранять счет в базу
        const paymentId: string = payment.paymentId || '4'
        tempPromise(paymentId).then((id: string) => {
            const action: IAction<IPayloadUpdatePayment> = {
                type: UPDATE_PAYMENT,
                payload: {tripId, paymentId: id, payment}
            }
            dispatch(action)
        })
    }
}

/**
 * Отмена редактирования счета.
 *
 */
export function cancelUpdatingPayment(): IAction<null> {
    return {
        type: CANCEL_UPDATING_PAYMENT,
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
