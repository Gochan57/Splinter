import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableHighlight, Switch} from 'react-native'
import {ListItem} from 'react-native-material-ui'

export default class PaymentItem extends Component {
    /**
     * tripId Идентификатор путешествия.
     */
    propTypes: {
        tripId: React.PropTypes.string,
    }

    state: {
        spentEqually: false,
        paidOne: false
    }

    render() {
        const {id, name, date, spent} = this.props
        return (
            <Switch
                onValueChange={(value) => this.setState({spentEqually: value})}
                onTintColor="#00ff00"
                thumbTintColor="#0000ff"
                tintColor="#ff0000"
                value={this.state.spentEqually} />
        )
    }
}