import {IPerson} from "../models/people";
import {IPersonBalance, ITrade} from "../models/transfers";

import * as _ from 'lodash'
import people from "../reducer/people";
import {min} from "moment";

export class Settle {
    constructor(people: IPersonBalance[]) {
        this.people = people
    }

    /**
     * Балансы
     */
    private people: IPersonBalance[]

    private result: ITrade[]

    private settleGroup(plus: IPersonBalance[], minus: IPersonBalance[]) {
        let i = 0, j: number = 0;
        while (i < plus.length && j < minus.length) {
            if (plus[i].balance > -minus[j].balance) {
                this.result.push({
                    fromPerson: minus[j].person,
                    toPerson: plus[i].person,
                    count: -minus[j].balance
                })
                plus[i].balance += -minus[j++].balance
            } else if (plus[i].balance < minus[j].balance) {
                this.result.push({
                    fromPerson: plus[i].person,
                    toPerson: minus[j].person,
                    count: plus[i].balance
                })
                minus[j].balance += plus[i++].balance
            }
            else if (plus[i].balance = -minus[j].balance) {
                this.result.push({
                    fromPerson: plus[i].person,
                    toPerson: minus[j].person,
                    count: plus[i].balance
                })
                i++;
                j++;
            }
        }
    }

    public settleUp(): ITrade[] {
        this.result = []
        const plus = new Bunch(_.filter(this.people, person => person.balance > 0))
        const minus = new Bunch(_.filter(this.people, person => person.balance < 0))

        while (plus.next()) {
            while (minus.next()) {
                const plusCur = plus.current()
                const minusCur = minus.current()

                const plusSum = _.reduce(plusCur, (sum, person) => sum + person.balance, 0)
                const minusSum = _.reduce(minusCur, (sum, person) => sum + person.balance, 0)
                if (plusSum + minusSum == 0) {
                    this.settleGroup(plusCur, minusCur)
                    plus.removeCurrent()
                    minus.removeCurrent()
                    minus.resetIndex()
                }
            }
            minus.resetIndex()
        }
        this.result.forEach(r => console.log("{\n\tfrom: " + r.fromPerson + "\n\tto: " + r.toPerson + "\n\tamount: " + r.count + "\n}"));
        return this.result;
    }
}

/**
 * Множество людей для перебора
 */
class Bunch {
    constructor(nodes: IPersonBalance[]) {
        this.nodes = nodes
    }

    /**
     * текущие указатели
     */
    private ix: number[]

    /**
     * люди
     */
    public nodes: IPersonBalance[]

    /**
     * текущий набор.
     */
    public current(): IPersonBalance[] {
        const res: IPersonBalance[] = []
        for (let i = 0; i < this.ix.length; i++) {
            res.push(this.nodes[this.ix[i]])
        }
        return res
    }

    public resetIndex() {
        this.ix = null
    }

    /**
     * следующий набор.
     */
    public next(): IPersonBalance[] {
        if (!this.nodes || !this.nodes.length) {
            return null
        }
        if (this.ix) {
            // после удаления элементов из массива, может сложиться ситуация, что пытаемся выбрать элементов больше, чем есть людей
            if (this.nodes.length < this.ix.length) {
                return null
            }
            // начиная с последнего указателя, пройдем все указатели, которые находятся в финальном положении
            let i = this.ix.length - 1
            while (this.ix[i] >= this.nodes.length - (this.ix.length - i) && i >= 0) {
                i--
            }
            // если дошли до указателя, который не находится в финальном положении, увеличим его на 1
            if (i >= 0) {
                this.ix[i] = this.ix[i] + 1
                i++
                // все остальные указатели выстроим по порядку после увеличенного
                while (i < this.ix.length) {
                    this.ix[i] = this.ix[i - 1] + 1
                    i++
                }
            }
            // если все указатели находятся в финальном положении, увеличим число элементов в выборке
            else {
                // если элементов в выборке больше, чем людей - заканчиваем
                if (this.ix.length >= this.nodes.length) {
                    return null
                }
                // задаем начальную выборку с еще одним элементом
                let newIx = []
                for (let i = 0; i < this.ix.length + 1; i++) {
                    newIx.push(i)
                }
                this.ix = newIx
            }
        }
        else {
            this.ix = [0]
        }
        return this.current()
    }

    /**
     * удалить текущий набор.
     */
    public removeCurrent() {
        for (let i = this.ix.length - 1; i >= 0; i--) {
            this.nodes.splice(this.ix[i], 1)
        }
        if (this.ix.length <= this.nodes.length) {
            for (let i = 0; i < this.ix.length; i++) {
                this.ix[i] = i
            }
        }
    }
}
