import React, {Component} from 'react'
import {View, TouchableHighlight, Text} from 'react-native'
import {ListItem} from 'react-native-material-ui'
import stylePropType from 'react-style-proptype'
import Icon from 'react-native-vector-icons/FontAwesome'
import appStyles from 'app/styles'

const styles = appStyles.commonStyles

/**
 * Компонент кнопки на всю ширину экрана.
 */
export default class WideButton extends Component {
    /**
     * onPress Коллбэк на нажатие на кнопку.
     * addBtn Кнопка добавления? Если true, перед кнопкой будет отображаться +. По умолчанию false.
     * text Текст на кнопке.
     * style Кастомный стиль.
     */
    static propTypes = {
        onPress: React.PropTypes.func.isRequired,
        addBtn: React.PropTypes.bool,
        text: React.PropTypes.string,
        style: stylePropType,
    }

    render() {
        const {onPress, addBtn = false, text} = this.props
        const leftElement = (addBtn ? <Icon name='plus' size={16} color='white'/> : null)
        const style = {
            contentViewContainer: styles.wideButtonContentViewContainer,
            primaryText: styles.wideButtonPrimaryText
        }
        return (
            <ListItem
                leftElement={leftElement}
                centerElement={text}
                onPress={onPress}
                style={{...style, ...this.props.style}}
            />
        )
    }
}
