import {
    START_UPDATING_PAYMENT,
    REMOVE_MEMBER_FROM_PAYMENT,
    SPENT_EQUALLY_SWITCHED,
    PAID_ONE_SWITCHED,
    CHANGE_MEMBER_SPENT_ON_PAYMENT,
    UPDATE_PAYMENT,
    CANCEL_UPDATING_PAYMENT,
    TEMPORARY_ID,
} from '../constants'
import {toArrayWithKeys,logError} from 'app/utils/utils'

/**
 * Начало создания нового счета.
 *
 * @param tripId - Идентификатор путешествия.
 */
export function startCreatingNewPayment(tripId) {
    return (dispatch, getState) => {
        // Составляем массив всех участников путешествия
        const members = toArrayWithKeys(getState().trips[tripId].people, 'personId')
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
 * Удаление участника из списка участников.
 *
 * @param tripId - Идентификатор путешествия. (TODO вообще-то tripId не нужен)
 * @param paymentId - Идентификатор счета.
 * @param personId - Идентификатор удаляемого участника.
 */
export function removeMemberFromPayment(tripId, paymentId, personId) {
    return (dispatch) => {
        dispatch({
            type: REMOVE_MEMBER_FROM_PAYMENT,
            payload: {tripId, paymentId, personId}
        })
    }
}

/**
 * Switch потратили поровну.
 *
 * @param spentEqually - Все потратили поровну?
 */
export function spentEquallySwitched(spentEqually) {
    return {
        type: SPENT_EQUALLY_SWITCHED,
        payload: {spentEqually}
    }
}

/**
 * Switch платил один.
 *
 * @param paidOne - Платил один?
 */
export function paidOneSwitched(paidOne) {
    return {
        type: PAID_ONE_SWITCHED,
        payload: {paidOne}
    }
}

/**
 * Изменение потраченных денег у участника счета.
 *
 * @param personId - Идентификатор участника.
 * @param value - Новое количество потраченных денег.
 */
export function changeMemberSpentOnPayment(personId, value) {
    const spent = parseInt(value) || 0
    return (dispatch) => {
        dispatch({
            type: CHANGE_MEMBER_SPENT_ON_PAYMENT,
            payload: {personId, spent}
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
