import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native'
import appStyles from 'app/styles'

const styles = appStyles.paymentStyles

export default class PaymentItem extends Component {
    constructor(props) {
        super(props)
    }

    propTypes: {
        id: React.PropTypes.string,
        name: React.PropTypes.array,
        onPress: React.PropTypes.func,
    }

    render() {
        return (
            <TouchableHighlight onPress={this.props.onPress}>
                <Text style={styles.item}>
                    {this.props.name}
                </Text>
            </TouchableHighlight>
        )
    }
}