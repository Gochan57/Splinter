import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native'
import {ListItem} from 'react-native-material-ui'

/**
 * Элемент в списке на экране со списком счетов.
 */
export default class PaymentsListItem extends Component {
    /**
     * @prop id Идентификатор счета.
     * @prop name Наименование счета.
     * @prop date Дата счета.
     * @prop sum Сумма счета.
     * @prop navigator Навигатор для перехода на другие экраны.
     */
    static propTypes = {
        id: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        date: React.PropTypes.string.isRequired,
        sum: React.PropTypes.number.isRequired,  // Сумма потраченных денег по счету
        navigator: React.PropTypes.object,
    }

    render() {
        const {id, name, date, sum} = this.props
        return (
            <ListItem
                key={id}
                centerElement={{
                    primaryText: name,
                    secondaryText: date
                }}
                rightElement={<Text>{sum}</Text>}
                onPress={() => {}}
                divider={true}
            />
        )
    }
}