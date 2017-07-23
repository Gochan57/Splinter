/**
 * Путешественник.
 *
 * personId Идентификатор путешественника (сквозная нумерация).
 * name Имя путешественника.
 */
export interface IPerson {
    personId: string,
    name: string
}

/**
 * Пэйлоад на создание нового путешественника.
 *
 * person - Новый путешественник.
 */
export interface IPayloadAddPerson {
    person: IPerson
}