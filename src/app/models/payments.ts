/**
 * Участник счета.
 *
 * personId Идентификатор путешественника.
 * spent Потратил.
 * paid Оплатил.
 * paidForAll Платил за всех.
 */
export interface IMember {
    personId: string,
    spent?: number,
    paid?: number,
    paidForAll?: boolean
}

/**
 * Счет.
 *
 * paymentId Идентификатор счета.
 * name Наименование счета.
 * date Дата и время создания счета (в формате ISO-8601).
 * members Участники счета.
 * spentEqually Все потратили поровну.
 * paidOne Платил один.
 * sum Общая сумма счета.
 */
export interface IPayment {
    paymentId?: string,
    name?: string,
    date?: string,
    members?: IMember[],
    spentEqually?: boolean,
    paidOne?: boolean,
    sum?: number
}

/**
 * Пэйлоад на создание/редактированияе счета.
 *
 * paymentId Идентификатор (при редактировании счета).
 * members Участники путешествия (при создании нового счета по умолчанию участники счета - все участники путешествия)
 */
export interface IPayloadStartUpdatingPayment {
    paymentId?: string,
    members?: IMember[]
}

/**
 * Пэйлоад на измененияе наименования счета.
 *
 * name Новое наименование счета.
 */
export interface IPayloadChangePaymentName {
    name: string,
}

/**
 * Пэйлоад на изменение списка участников счета.
 *
 * personIdList Массив id людей, участвующих в счете.
 */
export interface IPayloadSetMembersOfPayment {
    personIdList: string[]
}

/**
 * Пэйлоад на удаление участника из списка участников.
 *
 * spentEqually - Все потратили поровну.
 */
export interface IPayloadRemoveMemberFromPayment {
    personId: string
}

/**
 * Пэйлоад на переключение "Потратили поровну".
 *
 * personIdList Массив id людей, участвующих в счете.
 */
export interface IPayloadSpentEquallySwitched {
    spentEqually: boolean
}

/**
 * Пэйлоад на переключение "Платил один".
 *
 * paidOne - Платил один.
 */
export interface IPayloadPaidOneSwitched {
    paidOne: boolean
}

/**
 * Пэйлоад на изменение общей суммы счета.
 *
 * sum Сумма счета.
 */
export interface IPayloadChangeSumOnPayment {
    sum: number
}

/**
 * Пэйлоад на распределение суммы счета по всем участникам счета.
 *
 * spentEach Потратил каждый.
 */
export interface IPayloadSplitSumByMembers {
    spentEach: number
}

/**
 * Пэйлоад на отметить человека, как оплатившего счет за всех.
 *
 * personId - Человек, который оплатил счет.
 */
export interface IPayloadPaidForAllChecked {
    personId: string
}

/**
 * Пэйлоад, чтобы человеку, помеченному как платящего за весь счет, назначить в "потратил" общую сумму счета.
 *
 * personId - Человек, который оплатил счет.
 * sumSpent - Общее число потраченных денег.
 */
export interface IPayloadChangePaidToPayForAll {
    personId: string,
    sumSpent: number
}

/**
 * Пэйлоад на изменение потраченных денег у участника счета.
 *
 * personId - Участник счета.
 * spent - Потратил денег.
 * sum - Общая сумма счета.
 */
export interface IPayloadСhangeMemberSpentOnPayment {
    personId: string,
    spent: number,
    sum: number
}

/**
 * Пэйлоад на изменение заплаченных денег у участника счета.
 *
 * personId - Участник счета.
 * paid - Заплатил денег.
 */
export interface IPayloadChangeMemberPaidOnPayment {
    personId: string,
    paid: number
}

/**
 * Пэйлоад на сохранение обновленной информации о счете.
 *
 * tripId - Идентификатор путешествия.
 * paymentId - Идентификатор счета.
 * payment - Обновленный счет.
 */
export interface IPayloadUpdatePayment {
    tripId: string,
    paymentId: string,
    payment: IPayment
}
