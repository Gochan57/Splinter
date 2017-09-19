import {settleUp} from './utils/utils'
import {expect} from 'chai'
import {
    IPersonBalance,
    ITrade
} from './models/transfers';

const person1 = {personId: '1', name: 'Юля1'}
const person2 = {personId: '2', name: 'Юля2'}
const person3 = {personId: '3', name: 'Юля3'}

const balances1: IPersonBalance[] = [
    {person: person1, balance: 200},
    {person: person2, balance: -100},
    {person: person3, balance: -100},
]
const result1: ITrade[] = [
    {fromPerson:person2, toPerson:person1, count: 100},
    {fromPerson:person3, toPerson:person1, count: 100},
]

expect(result1).to.deep.equal(settleUp(balances1))
