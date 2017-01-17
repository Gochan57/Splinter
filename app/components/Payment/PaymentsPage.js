import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import PaymentsList from './PaymentsList'

export default class PaymentsPage extends Component {
    constructor(props) {
        super(props)
    }

    propTypes: {
        name: React.PropTypes.string,
        payments: React.PropTypes.array,
    }

    render() {
        const rPayments = this.reorganizePayments(this.props.payments)
        paymentsList = this.generatePaymentsList(rPayments)
        return (
            <View>
                <Text>{this.props.name}</Text>
                {paymentsList}
            </View>
        )
    }

    reorganizePayments = (payments) => {
        let rPayments = {}
        payments.forEach(payment => {
            if(!rPayments[payment.date]){
                rPayments[payment.date] = []
            }
            rPayments[payment.date].push(payment)
        })
        return rPayments
    }

    generatePaymentsList = (rPayments) => {
        let paymentsList = []
        for(date in rPayments) {
            paymentsList.push(<PaymentsList date={date} payments={rPayments[date]}/>)
        }
        return paymentsList
    }
}
