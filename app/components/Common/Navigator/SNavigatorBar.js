import React, {Component, PropTypes} from 'react'
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class SNavigatorBar extends Component {
    static propTypes = {
        LeftButton: PropTypes.oneOfType([PropTypes.element, PropTypes.shape({type: PropTypes.string, callback: PropTypes.func})]),
        RightButton: PropTypes.oneOfType([PropTypes.element, PropTypes.shape({type: PropTypes.string, callback: PropTypes.func})]),
        Title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
        LeftButtons: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.shape({type: PropTypes.string, callback: PropTypes.func})])),
        RightButtons: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.shape({type: PropTypes.string, callback: PropTypes.func})])),
    }

    renderButton = (button) => {
        return (
            <View style={[styles.centerContainer, styles.buttonContainer]}>
                {button}
            </View>
        )
    }

    renderButtons = (button, buttons, styleContainer) => {
        const buttonList = buttons || [button]
        const renderButtonList = buttonList.map(this.renderButton)

        return (<View style={[styles.centerContainer, styleContainer, styles.buttonsContainer]}>{renderButtonList}</View>)
    }

    renderLeftButtons = () => this.renderButtons(this.props.LeftButton, this.props.LeftButtons, styles.leftButtonsContainer)

    renderRightButtons = () => this.renderButtons(this.props.RightButton, this.props.RightButtons, styles.rightButtonsContainer)

    renderTitle = () => {
        const {Title} = this.props
        const titleElement = typeof Title === 'string'
            ? (<Text style={styles.titleText}>{Title}</Text>)
            : Title
        return (
            <View style={[styles.centerContainer, styles.titleContainer]}>
                {titleElement}
            </View>
        )
    }

    render() {
        return (
            <View style={[styles.centerContainer, styles.container]}>
                {this.renderLeftButtons()}
                {this.renderTitle()}
                {this.renderRightButtons()}
            </View>
        )
    }
}

/**
 * Иконки для строки навигатора.
 */
export const IconTypes = {
    back: 'chevron-left',
    OK: 'check'
}

/**
 * Кнопка для строки навигатора.
 *
 * @param type Строка из IconTypes.
 * @param callback
 */
export const button = (type, callback) => {
    return (
        <TouchableHighlight onPress={callback}>
            <Icon name={type} size={16} color={'#CCCCCC'}/>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        height: 40,
        backgroundColor: '#009E8E',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
    },
    buttonsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    leftButtonsContainer: {
        alignItems: 'flex-start'
    },
    rightButtonsContainer: {
        alignItems: 'flex-end'
    },
    buttonContainer: {
    },
    titleContainer: {
        flex: 4,
    },
    titleText: {
        fontSize: 16,
        color: 'white'
    }
})