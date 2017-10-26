/**
 * Путешественник.
 *
 * personId Идентификатор путешественника (сквозная нумерация).
 * name Имя путешественника.
 */
export interface IPerson {
    id: string,
    name: string
}

/**
 * Пэйлоад на добавление человека.
 *
 * person - Новый путешественник.
 */
export interface IPayloadAddPerson {
    person: IPerson
}

/**
 * Пэйлоад на редактирование человека.
 *
 * person - Новый путешественник.
 */
export interface IPayloadUpdatePerson {
    person: IPerson
}