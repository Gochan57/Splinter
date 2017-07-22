import React, {Component} from 'react'
import {ListItem} from 'react-native-material-ui'

/**
 * name Наименование путешествия.
 * onPress Коллбэк при нажатии на строку.
 */
export interface IProps {
    name: string,
    onPress: () => void
}

/**
 * Элемент в списке на экране со списком путешествий.
 */
export default class TripsListItem extends Component<IProps, null> {
    render() {
        const {name, onPress} = this.props
        return (
            <ListItem
                divider={true}
                centerElement={name}
                onPress={onPress}/>
        )
    }
}