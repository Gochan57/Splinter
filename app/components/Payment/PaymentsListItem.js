import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native'
import {ListItem} from 'react-native-material-ui'

/**
 * Элемент в списке на экране со списком счетов.
 */
export default class PaymentsListItem extends Component {
    /**
     * @prop tripId Идентификатор путешествия.
     * @prop id Идентификатор счета.
     * @prop name Наименование счета.
     * @prop date Дата счета.
     * @prop sum Сумма счета.
     * @prop onPress Коллбэк на нажатие на строку.
     * @prop navigator Навигатор для перехода на другие экраны.
     */
    static propTypes = {
        tripId: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        sum: PropTypes.number.isRequired,
        onPress: PropTypes.func,
        navigator: PropTypes.object,
    }

    render() {
        const {id, name, date, sum, onPress} = this.props
        return (
            <ListItem
                key={id}
                centerElement={{
                    primaryText: name,
                    secondaryText: date
                }}
                rightElement={<Text>{sum}</Text>}
                onPress={onPress}
                divider={true}
            />
        )
    }
}