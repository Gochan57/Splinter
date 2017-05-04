import {UPDATE_NEW_PAYMENT, REMOVE_MEMBER_FROM_NEW_PAYMENT} from '../constants'

/**
 * Обновление информации о добавлении нового счета.
 *
 * @param newPayment - Информация о новом счете (структуру см. в reducer/payments.js const newPayment).
 */
export function updateNewPayment(newPayment) {
    return {
        type: UPDATE_NEW_PAYMENT,
        payload: {
            newPayment
        }
    }
}

/**
 * Удаление участника из списка участников при добавлении нового счета.
 *
 * @param id - Идентификатор удаляемого участника.
 */
export function removeMemberFromNewPayment(id) {
    return (dispatch) => {
        dispatch({
            type: REMOVE_MEMBER_FROM_NEW_PAYMENT,
            payload: {
                id
            }
        })
    }
}
