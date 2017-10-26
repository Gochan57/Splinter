import {
    IPayloadAddPerson,
    IPayloadUpdatePerson,
    IPerson
} from 'app/models/people'
import {
    IAction,
    IStorable,
} from 'app/models/common'
import {
    ADD_PERSON,
    UPDATE_PERSON
} from '../constants';

const defaultPeople: IStorable<IPerson> = {
    '1': {
        id: '1',
        name: 'Юля'
    },
    '2': {
        id: '2',
        name: 'Гоша'
    },
    '3': {
        id: '3',
        name: 'Вова'
    },
    '4': {
        id: '4',
        name: 'Юля'
    },
    '5': {
        id: '5',
        name: 'Надя'
    },
    '6': {
        id: '6',
        name: 'Костя'
    },
    '7': {
        id: '7',
        name: 'Саня'
    },
    '8': {
        id: '8',
        name: 'Мегги'
    },
    '9': {
        id: '9',
        name: 'Гоша'
    },
}

export default (state = defaultPeople, action: IAction<any>) => {
    if (action && action.type && reducer[action.type]) {
        return reducer[action.type](state, action.payload)
    }
    return state
}

// Указанный тип у reducer - небольшой хак, чтобы обмануть typescript насчет нисходящего приведения типов.
// По-хорошему, ни здесь ни сверху в типе action не должно быть указано any.
// Однако в таком виде ts не ругается, и для каждого действия задана типизация payload, к чему и стремились.
const reducer: {[key: string]: any} = {
    [ADD_PERSON]: function(people: IStorable<IPerson>, payload: IPayloadAddPerson): IStorable<IPerson> {
        const {person} = payload
        return {...people, [person.id]: person}
    },
    [UPDATE_PERSON]: function(people: IStorable<IPerson>, payload: IPayloadUpdatePerson): IStorable<IPerson> {
        const {person} = payload
        return {...people, [person.id]: person}
    }
}

