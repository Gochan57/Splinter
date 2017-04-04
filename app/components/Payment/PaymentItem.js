import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native'
import {ListItem} from 'react-native-material-ui'

export default class PaymentItem extends Component {
    propTypes: {
        id: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        date: React.PropTypes.string.isRequired,
        spent: React.PropTypes.number.isRequired,  // Сумма потраченных денег по счету
    }

    render() {
        const {id, name, date, spent} = this.props
        return (
            <ListItem
                key={id}
                centerElement={{
                    primaryText: name,
                    secondaryText: date
                }}
                rightElement={<Text>{spent}</Text>}
                onPress={() => {}}
                divider={true}
            />
        )
    }
}