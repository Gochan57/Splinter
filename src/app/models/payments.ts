import {IAction} from './common'
import {IPerson} from './people';
import {ITrip} from './trips';
/**
 * Участник счета.
 *
 * person Идентификатор путешественника.
 * spent Потратил.
 * paid Оплатил.
 * paidForAll Платил за всех.
 */
export interface IMember {
    person: IPerson,
    spent?: number,
    paid?: number,
    paidForAll?: boolean
}

/**
 * Участник счета (формат для стора).
 *
 * personId Идентификатор путешественника.
 * spent Потратил.
 * paid Оплатил.
 * paidForAll Платил за всех.
 */
export interface IStoreMember {
    personId: string,
    spent?: number,
    paid?: number,
    paidForAll?: boolean
}

/**
 * Счет.
 *
 * id Идентификатор счета.
 * name Наименование счета.
 * date Дата и время создания счета (в формате ISO-8601).
 * members Участники счета.
 * spentEqually Все потратили поровну.
 * paidOne Платил один.
 * sum Общая сумма счета.
 */
export interface IPayment {
    id?: string,
    name?: string,
    date?: Date,
    members: IMember[],
    spentEqually?: boolean,
    paidOne?: boolean,
    sum?: number
}

/**
 * Счет.
 *
 * id Идентификатор счета.
 * name Наименование счета.
 * date Дата и время создания счета (в формате ISO-8601).
 * members Участники счета.
 * spentEqually Все потратили поровну.
 * paidOne Платил один.
 * sum Общая сумма счета.
 */
export interface IStorePayment {
    id?: string,
    name?: string,
    date?: Date,
    members: IStoreMember[],
    spentEqually?: boolean,
    paidOne?: boolean,
    sum?: number
}

export interface IPaymentActions {
    startCreatingNewPayment: (trip: ITrip) => void,
    setCurrentPayment: (payment: IStorePayment) => void,
    startUpdatingPayment: (paymentId: string) => void,
    changePaymentName: (name: string) => void,
    setMembersOfPayment: (personIdList: string[]) => void,
    removeMemberFromPayment: (personId: string) => void,
    spentEquallySwitched: (spentEqually: boolean) => void,
    paidOneSwitched: (paidOne: boolean) => void,
    resetPaidForAll: () => void,
    changeSumOnPayment: (sum: number) => void,
    splitSumByMembers: (sum?: number) => void,
    paidForAllChecked: (personId: string) => void,
    changePaidToPayForAll: (personId?: string) => void,
    changeMemberSpentOnPayment: (personId: string, value: number) => void,
    changeMemberPaidOnPayment: (personId: string, value: number) => void,
    updatePayment: (tripId: string) => void,
    cancelUpdatingPayment: () => void,
}

export const defaultPayment: IStorePayment = {
    id: null,
    members: [],
    spentEqually: false,
    paidOne: false,
    sum: 0
}
