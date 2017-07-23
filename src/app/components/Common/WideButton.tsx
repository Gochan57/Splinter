import React, {Component} from 'react'
import {ViewStyle} from 'react-native'
import {ListItem} from 'react-native-material-ui'
import Icon from 'react-native-vector-icons/FontAwesome'
import appStyles from 'app/styles'

const styles = appStyles.commonStyles

interface IProps {
    onPress: () => void,
    addBtn?: boolean,
    text: string,
    style?: ViewStyle
}

/**
 * Компонент кнопки на всю ширину экрана.
 */
export default class WideButton extends Component<IProps, null> {

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
