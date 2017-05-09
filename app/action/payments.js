import {START_CREATING_NEW_PAYMENT, UPDATE_PAYMENT, REMOVE_MEMBER_FROM_PAYMENT, CHANGE_MEMBER_SPENT_ON_PAYMENT} from '../constants'
import {toArrayWithKeys} from 'app/utils/utils'

/**
 * Начало создания нового счета.
 *
 * @param tripId - Идентификатор путешествия.
 */
export function startCreatingNewPayment(tripId) {
    return (dispatch, getState) => {
        // Составляем массив всех участников путешествия
        const members = toArrayWithKeys(getState().trips[tripId].people, 'personId')
        // TODO get nextId from PAYMENTS table
        tempPromise(4).then((paymentId) => {
            dispatch({
                type: START_CREATING_NEW_PAYMENT,
                payload: {tripId, paymentId, members}
            })
        })
    }
}

/**
 * Обновление информации о счете.
 *
 * @param tripId - Идентификатор путешествия.
 * @param paymentId - Идентификатор счета.
 * @param newPayment - Информация о новом счете (структуру см. в reducer/payments.js const newPayment).
 */
export function updatePayment(tripId, paymentId, newPayment) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PAYMENT,
            payload: {tripId, paymentId, newPayment}
        })
    }
}

/**
 * Удаление участника из списка участников.
 *
 * @param tripId - Идентификатор путешествия. (TODO вообще-то tripId не нужен)
 * @param paymentId - Идентификатор счета.
 * @param memberId - Идентификатор удаляемого участника.
 */
export function removeMemberFromPayment(tripId, paymentId, memberId) {
    return (dispatch) => {
        dispatch({
            type: REMOVE_MEMBER_FROM_PAYMENT,
            payload: {tripId, paymentId, memberId}
        })
    }
}

/**
 * Изменение потраченных денег у участника счета.
 *
 * @param tripId - Идентификатор путешествия.
 * @param paymentId - Идентификатор счета.
 * @param memberId - Идентификатор участника.
 * @param spent - Новое количество потраченных денег.
 */
export function changeMemberSpentOnPayment(tripId, paymentId, memberId, spent) {
    return (dispatch) => {
        dispatch({
            type: CHANGE_MEMBER_SPENT_ON_PAYMENT,
            payload: {tripId, paymentId, memberId, spent}
        })
    }
}

function tempPromise(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data)
        }, 500)
    })
}
