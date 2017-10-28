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
import {toNumber} from 'app/utils/utils'
import * as _ from 'lodash'

/**
 * Начало создания нового счета.
 *
 * @param tripId - Идентификатор путешествия.
 */
export function startCreatingNewPayment(tripId) {
    return (dispatch, getState) => {
        // Составляем массив всех участников путешествия
        const people = getState().trips[tripId].people
        const members = people && _.map(Object.keys(people), personId => ({personId}))
        dispatch({
            type: START_UPDATING_PAYMENT,
            payload: {tripId, members}
        })
    }
}

/**
 * Начало редактирования счета.
 *
 * @param tripId - Идентификатор путешествия.
 * @param paymentId - Идентификатор счета.
 */
export function startUpdatingPayment(tripId, paymentId) {
    return (dispatch, getState) => {
        dispatch({
            type: START_UPDATING_PAYMENT,
            payload: {tripId, paymentId}
        })
    }
}

/**
 * Изменение названия счета.
 *
 * @param name - Название счета.
 */
export function changePaymentName(name) {
    return (dispatch, getState) => {
        dispatch({
            type: CHANGE_PAYMENT_NAME,
            payload: {name}
        })
    }
}

/**
 * Изменение списка участников счета.
 *
 * @param personIdList Массив id людей, участвующих в счете.
 */
export function setMembersOfPayment(personIdList) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_MEMBERS_OF_PAYMENT,
            payload: {personIdList}
        })
        // Если выбрано "Платили поровну", то разделим счет на участников счета.
        if (getState().payments[TEMPORARY_ID].spentEqually) {
            dispatch(splitSumByMembers())
        }
    }
}

/**
 * Удаление участника из списка участников.
 *
 * @param tripId - Идентификатор путешествия. (TODO вообще-то tripId не нужен)
 * @param paymentId - Идентификатор счета.
 * @param personId - Идентификатор удаляемого участника.
 */
export function removeMemberFromPayment(tripId, paymentId, personId) {
    return (dispatch, getState) => {
        dispatch({
            type: REMOVE_MEMBER_FROM_PAYMENT,
            payload: {tripId, paymentId, personId}
        })
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
export function spentEquallySwitched(spentEqually) {
    return (dispatch, getState) => {
        dispatch ({
            type: SPENT_EQUALLY_SWITCHED,
            payload: {spentEqually}
        })
        if (spentEqually) {
            // Если переключили на "Потратили поровну", разделим сумму счета по всем участникам
            // Делаем небольшую задержку на случай, если переключили свитчер, не сняв фокус с инпута потраченных денег
            // одного из участников счета, чтобы успело обновиться значение его потраченных денег.
            //setTimeout(() => {dispatch(splitSumByMembers())}, 100)
            setTimeout(() => {dispatch(splitSumByMembers())}, 100)
        }
    }
}

/**
 * Переключение "Платил один".
 *
 * @param paidOne - Платил один?
 */
export function paidOneSwitched(paidOne) {
    return dispatch => {
        dispatch({
            type: PAID_ONE_SWITCHED,
            payload: {paidOne}
        })
        if (!paidOne) {
            // Если выключили "Платил один", то снимем галочку с человека, помеченного как платящего за всех.
            dispatch(resetPaidForAll())
        }
    }
}

/**
 * Сбросить всем участникам счета галочку "Платил за всех".
 */
export function resetPaidForAll() {
    return {
        type: RESET_PAID_FOR_ALL,
        payload: {}
    }
}

/**
 * Изменение общей суммы счета.
 *
 * @param sum - Общая сумма счета.
 */
export function changeSumOnPayment(sum) {
    return (dispatch) => {
        dispatch({
            type: CHANGE_SUM_ON_PAYMENT,
            payload: {sum}
        })
        dispatch(splitSumByMembers(sum))
    }
}

/**
 * Распределение суммы счета по всем участникам счета.
 *
 * [sum] Сумма счета.
 */
export function splitSumByMembers(sum) {
    return (dispatch, getState) => {
        const payment = getState().payments[TEMPORARY_ID]
        if (payment.members && payment.members.length > 0) {
            const _sum = sum || payment.sum
            const spentEach = _sum / payment.members.length
            dispatch({
                type: SPLIT_SUM_BY_MEMBERS,
                payload: {spentEach}
            })
        }
    }
}

/**
 * Отметить человека, как оплатившего счет за всех.
 *
 * @param personId - Человек, который оплатил счет.
 */
export function paidForAllChecked(personId) {
    return (dispatch, getState) => {
        dispatch ({
            type: PAID_FOR_ALL_CHECKED,
            payload: {personId}
        })
        dispatch(changePaidToPayForAll(personId))
    }
}

/**
 * Отметить человека, как оплатившего счет за всех.
 *
 * @param personId - Человек, который оплатил счет.
 */
export function changePaidToPayForAll(personId) {
    return (dispatch, getState) => {
        // считаем сумму потраченных денег
        const members = getState().payments[TEMPORARY_ID].members
        const sumSpent = _.reduce(members, (sum, member) => sum + toNumber(member.spent), 0)
        // если personId не передан, можно вычислить его из метки paidForAll у участника счета
        if (!personId) {
            personId = _.find(members, member => member.paidForAll).personId
        }
        dispatch ({
            type: CHANGE_PAID_TO_PAY_FOR_ALL,
            payload: {personId, sumSpent}
        })
    }
}

/**
 * Изменение потраченных денег у участника счета.
 *
 * @param personId - Идентификатор участника.
 * @param value - Новое количество потраченных денег.
 */
export function changeMemberSpentOnPayment(personId, value) {
    const spent = toNumber(value)
    return (dispatch, getState) => {
        // считаем сумму редактируемого счета
        const payment = getState().payments[TEMPORARY_ID]
        const sum = _.reduce(payment.members, (sum, member) => {
            const spent = (member.personId == personId ? toNumber(value) : toNumber(member.spent))
            return sum + spent
        }, 0)
        dispatch({
            type: CHANGE_MEMBER_SPENT_ON_PAYMENT,
            payload: {personId, spent, sum}
        })
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
export function changeMemberPaidOnPayment(personId, value) {
    const paid = toNumber(value)
    return (dispatch, getState) => {
        dispatch({
            type: CHANGE_MEMBER_PAID_ON_PAYMENT,
            payload: {personId, paid: value}
        })
    }
}

/**
 * Сохранение обновленной информации о счете.
 *
 * @param tripId - Идентификатор путешествия.
 */
export function updatePayment(tripId) {
    return (dispatch, getState) => {
        const payment = getState().payments[TEMPORARY_ID]
        // FIXME сохранять счет в базу
        const paymentId = payment.paymentId || '4'
        tempPromise(paymentId).then(id => {
            dispatch({
                type: UPDATE_PAYMENT,
                payload: {tripId, paymentId: id, payment}
            })
        })
    }
}

/**
 * Отмена редактирования счета.
 *
 */
export function cancelUpdatingPayment() {
    return {
        type: CANCEL_UPDATING_PAYMENT,
    }
}

function tempPromise(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data)
        }, 500)
    })
}
