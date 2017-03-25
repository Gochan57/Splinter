import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import PaymentItem from './PaymentItem'

export default class PaymentsList extends Component {
    constructor(props) {
        super(props)
    }

    propTypes: {
        date: React.PropTypes.string,
        payments: React.PropTypes.array,
    }

    _onPress = (e) => {
        console.log('hi');
    }

    render() {
        console.log('PaymentsList props', this.props)
        const paymentsList = this.props.payments.map(payment =>
            <PaymentItem key={payment.id} name={payment.name} onPress={this._onPress}/>
        )
        console.log('paymentsList', paymentsList)

        return (
            <View>
                <Text>{this.props.date}</Text>
                {paymentsList}
            </View>
        )
    }
}