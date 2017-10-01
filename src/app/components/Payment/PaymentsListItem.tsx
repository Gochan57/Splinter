import React, {Component} from 'react'
import {Text} from 'react-native'
import {ListItem} from 'react-native-material-ui'
import {dateToString} from '../../utils/utils';

/**
 * tripId Идентификатор путешествия.
 * id Идентификатор счета.
 * name Наименование счета.
 * date Дата счета.
 * sum Сумма счета.
 * onPress Коллбэк на нажатие на строку.
 */
interface IProps {
    tripId: string,
    id: string,
    name: string,
    date: Date,
    sum: number,
    onPress?: () => void,
}

/**
 * Элемент в списке на экране со списком счетов.
 */
export default class PaymentsListItem extends Component<IProps, null> {
    render() {
        const {id, name, date, sum, onPress} = this.props
        return (
            <ListItem
                key={id}
                centerElement={{
                    primaryText: name,
                    secondaryText: dateToString(date)
                }}
                rightElement={<Text>{sum}</Text>}
                onPress={onPress}
                divider={true}
            />
        )
    }
}