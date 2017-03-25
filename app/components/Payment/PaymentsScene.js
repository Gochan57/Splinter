import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {toArrayWithKeys} from 'app/utils/utils';
import PaymentsList from './PaymentsList'

export default class PaymentsScene extends Component {
    constructor(props) {
        super(props)
    }

    propTypes: {
        tripId: React.PropTypes.number,
        payments: React.PropTypes.object,
    }

    renderPayments () {
        const {payments} = this.props
        if (!payments) {
            return (
                <View>
                    <Text>В этом путешествии пока нет ни одного счета</Text>
                </View>
            )
        }
        const dates = Object.keys(payments)
        console.log('dates', dates)
        const paymentsList = dates.map(date =>
            <PaymentsList
                key={date}
                date={date}
                payments={toArrayWithKeys(payments[date])}/>)
        console.log('PaymentsList', paymentsList)
        return (
            <View>
                {paymentsList}
            </View>
        )
    }

    componentWillMount () {
        console.log('PaymentsScene props', this.props)
    }

    render() {
        const payments = this.renderPayments()
        return (
            <View>
                {payments}
            </View>
        )
    }

    reorganizePayments = (payments) => {
        let arrPayments = {}
        payments.forEach(payment => {
            if(!arrPayments[payment.date]){
                arrPayments[payment.date] = []
            }
            arrPayments[payment.date].push(payment)
        })
        return arrPayments
    }

    generatePaymentsList = (arrPayments) => {
        let paymentsList = []
        for(date in arrPayments) {
            paymentsList.push(<PaymentsList date={date} payments={arrPayments[date]}/>)
        }
        return paymentsList
    }
}
