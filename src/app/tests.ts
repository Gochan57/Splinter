import {Settle} from './utils/sette'
import {expect} from 'chai'
import {
    IPersonBalance,
    ITrade
} from './models/transfers';

const person1 = {id: '1', name: 'Юля1'}
const person2 = {id: '2', name: 'Юля2'}
const person3 = {id: '3', name: 'Юля3'}

const balances1: IPersonBalance[] = [
    {person: person1, balance: 200},
    {person: person2, balance: -100},
    {person: person3, balance: -100},
]
const result1: ITrade[] = [
    {fromPerson:person2, toPerson:person1, count: 100},
    {fromPerson:person3, toPerson:person1, count: 100},
]
var settle = new Settle(balances1);

expect(result1).to.deep.equal(settle.settleUp())
