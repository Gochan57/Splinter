import {
    IStoreMember,
    IStorePayment,
} from 'app/models/payments'
import * as _ from 'lodash'

/**
 * Задаем текущий счет.
 *
 * @param payment - Счет.
 */
export function setCurrentPayment (payment: IStorePayment): IPaymentAction {
    return {
        type: 'SET_CURRENT_PAYMENT',
        payload: {payment}
    }
}

/**
 * Изменение названия счета.
 *
 * @param name - Название счета.
 */
export function changePaymentName (name: string): IPaymentAction {
    return {
        type: 'CHANGE_PAYMENT_NAME',
        payload: {name}
    }
}

/**
 * Изменение списка участников счета.
 *
 * @param personIdList Массив id людей, участвующих в счете.
 */
export function setMembersOfPayment (members: IStoreMember[]): IPaymentAction {
    return {
        type: 'SET_MEMBERS_OF_PAYMENT',
        payload: {members}
    }
}

/**
 * Удаление участника из списка участников.
 *
 * @param personId - Идентификатор удаляемого участника.
 */
export function removeMemberFromPayment (personId: string): IPaymentAction {
    return {
        type: 'REMOVE_MEMBER_FROM_PAYMENT',
        payload: {personId}
    }
}

/**
 * Переключение "Потратили поровну".
 *
 * @param spentEqually - Все потратили поровну?
 */
export function spentEquallySwitched (spentEqually: boolean): IPaymentAction {
    return {
        type: 'SPENT_EQUALLY_SWITCHED',
        payload: {spentEqually}
    }
}

/**
 * Переключение "Платил один".
 *
 * @param paidOne - Платил один?
 */
export function paidOneSwitched (paidOne: boolean): IPaymentAction {
    return {
        type: 'PAID_ONE_SWITCHED',
        payload: {paidOne}
    }
}

/**
 * Сбросить всем участникам счета галочку "Платил за всех".
 */
export function resetPaidForAll (): IPaymentAction {
    return {
        type: 'RESET_PAID_FOR_ALL'
    }
}

/**
 * Изменение общей суммы счета.
 *
 * param sum - Общая сумма счета.
 */
export function changeSumOnPayment (sum: number): IPaymentAction {
    return {
        type: 'CHANGE_SUM_ON_PAYMENT',
        payload: {sum}
    }
}

/**
 * Распределение суммы счета по всем участникам счета.
 *
 * param [sum] Сумма счета.
 */
export function splitSumByMembers (spentEach?: number): IPaymentAction {
    return {
        type: 'SPLIT_SUM_BY_MEMBERS',
        payload: {spentEach}
    }
}

/**
 * Отметить человека, как оплатившего счет за всех.
 *
 * @param personId - Человек, который оплатил счет.
 */
export function paidForAllChecked (personId: string): IPaymentAction {
    return {
        type: 'PAID_FOR_ALL_CHECKED',
        payload: {personId}
    }
}

/**
 * Человеку, помеченному как платящего за весь счет, назначить в "потратил" общую сумму счета.
 *
 * @param [personId] - Человек, который оплатил счет.
 */
export function changePaidToPayForAll (personId: string, sumSpent: number): IPaymentAction {
    return {
        type: 'CHANGE_PAID_TO_PAY_FOR_ALL',
        payload: {
            personId,
            sumSpent
        }
    }
}

/**
 * Изменение потраченных денег у участника счета.
 *
 * @param personId - Идентификатор участника.
 * @param value - Новое количество потраченных денег.
 */
export function changeMemberSpentOnPayment (personId: string, spent: number, sum: number): IPaymentAction {
    return {
        type: 'CHANGE_MEMBER_SPENT_ON_PAYMENT',
        payload: {
            personId,
            spent,
            sum
        }
    }
}

/**
 * Изменение заплаченных денег у участника счета.
 *
 * @param personId - Идентификатор участника.
 * @param value - Новое количество заплаченных денег.
 */
export function changeMemberPaidOnPayment (personId: string, paid: number): IPaymentAction {
    return {
        type: 'CHANGE_MEMBER_PAID_ON_PAYMENT',
        payload: {
            personId,
            paid
        }
    }
}

/**
 * Сохранение обновленной информации о счете.
 *
 * @param tripId - Идентификатор путешествия.
 */
export function updatePayment (tripId: string, payment: IStorePayment): IPaymentAction {
    return {
        type: 'UPDATE_PAYMENT',
        payload: {
            tripId,
            payment
        }
    }
}

/**
 * Отмена редактирования счета.
 *
 */
export function cancelUpdatingPayment (): IPaymentAction {
    return {
        type: 'CANCEL_UPDATING_PAYMENT',
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
function tempPromise (data: any) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data)
        }, 500)
    })
}

export type IPaymentAction =
    {
        type: 'SET_CURRENT_PAYMENT',
        payload: { payment: IStorePayment }
    } |
    {
        type: 'CHANGE_PAYMENT_NAME',
        payload: { name: string }
    } |
    {
        type: 'SET_MEMBERS_OF_PAYMENT',
        payload: { members: IStoreMember[] }
    } |
    {
        type: 'REMOVE_MEMBER_FROM_PAYMENT',
        payload: { personId: string }
    } |
    {
        type: 'SPENT_EQUALLY_SWITCHED',
        payload: { spentEqually: boolean }
    } |
    {
        type: 'PAID_ONE_SWITCHED',
        payload: { paidOne: boolean }
    } |
    {
        type: 'RESET_PAID_FOR_ALL'
    } |
    {
        type: 'CHANGE_SUM_ON_PAYMENT',
        payload: { sum: number }
    } |
    {
        type: 'SPLIT_SUM_BY_MEMBERS',
        payload: { spentEach: number }
    } |
    {
        type: 'PAID_FOR_ALL_CHECKED',
        payload: { personId: string }
    } |
    {
        type: 'CHANGE_PAID_TO_PAY_FOR_ALL',
        payload: {
            personId: string,
            sumSpent: number
        }
    } |
    {
        type: 'CHANGE_MEMBER_SPENT_ON_PAYMENT',
        payload: {
            personId,
            spent,
            sum
        }
    } |
    {
        type: 'CHANGE_MEMBER_PAID_ON_PAYMENT',
        payload: {
            personId,
            paid
        }
    } |
    {
        type: 'UPDATE_PAYMENT',
        payload: {
            tripId,
            payment
        }
    } |
    {
        type: 'CANCEL_UPDATING_PAYMENT',
    }