import React, {Component} from 'react'
import {View, Text} from 'react-native'
import {ListItem} from 'react-native-material-ui'
import appStyles from 'app/styles'

const styles = appStyles.tripItemStyles

/**
 * Элемент в списке на экране со списком путешествий.
 */
export default class TripsListItem extends Component {

    static title = 'Счета'

    /**
     * name Наименование путешествия.
     * onPress Коллбэк при нажатии на строку.
     */
    static propTypes = {
        name: React.PropTypes.string,
        onPress: React.PropTypes.func,
    }

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