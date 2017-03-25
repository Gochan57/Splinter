import {ADD_TRIP} from '../constants'
import {getMaxId} from 'app/utils/utils'

const trips = {
    '1': {
        name: 'Sri Lanka',
        people: {
            '1': {name: 'Юля'},
            '2': {name: 'Гоша'},
            '3': {name: 'Вова'},
        },
        payments: {
            '01.02.2017': {
                '1': {
                    name: 'Супермаркет',
                    members: [
                        {personId: '1', spend: 100, pay: 0},
                        {personId: '2', spend: 100, pay: 200},
                    ]
                },
                '2': {
                    name: 'Обучение у Сусы',
                    members: [
                        {personId: '1', spend: 50, pay: 0},
                        {personId: '2', spend: 50, pay: 150},
                        {personId: '3', spend: 50, pay: 0},
                    ]
                }
            },
            '02.02.2017': {
                '3': {
                    name: 'Такси',
                    members: [
                        {personId: '1', spend: 200, pay: 400},
                        {personId: '3', spend: 200, pay: 0},
                    ]
                }
            }
        }
    },
    '2': {
        name: 'Kazan',
        people: {
            '4': {name: 'Юля'},
            '5': {name: 'Надя'},
            '6': {name: 'Костя'},
        }
    },
    '3': {
        name: 'Morocco',
        people: {
            '7': {name: 'Саня'},
            '8': {name: 'Мегги'},
            '9': {name: 'Гоша'},
        }
    }
}

//TODO передавать id из экшна
export default (state = trips, action) => {
    console.log('action:', action)
    const {type, payload} = action

    switch(type) {
        case ADD_TRIP: {
            const {name, people} = payload
            const newId = getMaxId(state) + 1
            const newState = {...state, [newId]: {name}}
            return newState
        }
    }

    return state
}
