import {Settle} from './utils/settle'
import {expect} from 'chai'
import {
    IPersonBalance,
    ITrade
} from './models/transfers';

const person1 = {id: '1', name: 'Юля1'}
const person2 = {id: '2', name: 'Юля2'}
const person3 = {id: '3', name: 'Юля3'}
const person4 = {id: '4', name: 'Юля4'}
const person5 = {id: '5', name: 'Юля5'}
const person6 = {id: '6', name: 'Юля6'}
const person7 = {id: '7', name: 'Юля7'}
const person8 = {id: '8', name: 'Юля8'}
const person9 = {id: '9', name: 'Юля9'}
const person10 = {id: '10', name: 'Юля10'}

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


const balances2: IPersonBalance[] = [
    {person: person1, balance: 10},
    {person: person2, balance: -50},
    {person: person3, balance: -65},
    {person: person4, balance: 45},
    {person: person5, balance: -100},
    {person: person6, balance: -80},
    {person: person7, balance: 30},
    {person: person8, balance: 30},
    {person: person9, balance: 90},
    {person: person10, balance: 90},
]
const result2: ITrade[] = [
    {fromPerson:person5, toPerson:person1, count: 10},
    {fromPerson:person5, toPerson:person9, count: 90},
    {fromPerson:person2, toPerson:person7, count: 30},
    {fromPerson:person2, toPerson:person8, count: 20},
    {fromPerson:person3, toPerson:person8, count: 10},
    {fromPerson:person3, toPerson:person4, count: 45},
    {fromPerson:person3, toPerson:person10, count: 10},
    {fromPerson:person6, toPerson:person10, count: 80},
]
var settle = new Settle(balances2);

expect(result2).to.deep.equal(settle.settleUp())
