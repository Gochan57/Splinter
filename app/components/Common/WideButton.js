import React, {Component} from 'react'
import {View, TouchableHighlight, Text} from 'react-native'
import {ListItem} from 'react-native-material-ui'
import Icon from 'react-native-vector-icons/FontAwesome'
import appStyles from 'app/styles'

const styles = appStyles.commonStyles

export default class WideButton extends Component {
    propTypes: {
        onPress: React.propTypes.func.isRequired,
        addBtn: React.propTypes.boolean, // Кнопка добавления? Если true, перед кнопкой будет отображаться +. По умолчанию false.
        text: React.propTypes.string,
    }

    render() {
        const {onPress, addBtn = false, text} = this.props
        const leftElement = (addBtn ? <Icon name='plus' size={16} color='white'/> : null)
        return (
            <ListItem
                leftElement={leftElement}
                centerElement={text}
                onPress={onPress}
                style={{contentViewContainer: styles.wideButtonContentViewContainer, primaryText: styles.wideButtonPrimaryText}}
            />
        )
    }
}
