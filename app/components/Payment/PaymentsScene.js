import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import moment from 'moment'
import {toArrayWithKeys} from 'app/utils/utils'
import appStyles from 'app/styles'
import PaymentItem from './PaymentItem'

const styles =  appStyles.commonStyles

export default class PaymentsScene extends Component {
    /**
     * @prop tripId Идентификатор путешествия.
     * @prop payments
     * {
     *  [id]: { Идентификатор платежа
     *      name, Название платежа
     *      date, Дата платежа DD.MM.YYYY HH:MI:SS
     *      members: [{ Участники
     *          personId, Идентификатор участника
     *          spend, Потратил
     *          pay Оплатил
     *      }]
     *  }
     * }
     */
    propTypes: {
        tripId: React.PropTypes.number,
        payments: React.PropTypes.object,
    }

    renderPaymentsList = () => {
        const {payments} = this.props
        if (!payments || !Object.keys(payments).length) {
            return (
                <View style={styles.infoTextContainer}>
                    <Text style={styles.infoText}>Пока нет ни одного счета</Text>
                </View>
            )
        }
        // Преобразуем payments из стора в массив
        let _payments = toArrayWithKeys(payments)
        // И сортируем в порядке убывания даты платежа
            .sort((p1, p2) => moment(p2.date, 'DD.MM.YYYY HH:MI').diff(moment(p1.date, 'DD.MM.YYYY HH:MI'), 'seconds'))
        const paymentsList = _payments.map(payment => {
            const {id, name, date, members} = payment
            const spent = members.reduce((s, v) => s + v.spend, 0)
            return (
                <PaymentItem key={id} id={id} name={name} date={date} spent={spent}/>
            )
        })
        return (
            <View>
                {paymentsList}
            </View>
        )
    }

    render() {
        return (
            <View>
                {this.renderPaymentsList()}
            </View>
        )
    }
}

