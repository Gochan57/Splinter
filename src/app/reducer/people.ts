import {
    IPerson
} from 'app/models/people'
import {
    IStorable,
} from 'app/models/common'
import {IAction} from '../action/index';

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

export default (people: IStorable<IPerson> = defaultPeople, action: IAction): IStorable<IPerson> => {
    if (!action) {
        return people
    }

    switch (action.type) {
        case 'ADD_PERSON': {
            const {person} = action.payload
            return {...people, [person.id]: person}
        }
        case 'UPDATE_PERSON': {
            const {person} = action.payload
            return {...people, [person.id]: person}
        }
        default: {
            return people
        }
    }
}
