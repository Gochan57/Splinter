import React, {
    Component,
    ReactElement,
} from 'react'
import {
    StyleSheet,
    Text,
    TextProperties,
    TouchableHighlight,
    View,
    ViewProperties
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

/**
 * Для передачи в пропсы кнопки необходимо воспользоваться функцией button,
 * передав ей на вход тип кнопки (IconType) и действие (callback).
 */
interface INavigatorBarProps {
    LeftButton?: ReactElement<ViewProperties>,
    RightButton?: ReactElement<ViewProperties>,
    Title: string | ReactElement<TextProperties>,
    LeftButtons?: ReactElement<ViewProperties>[],
    RightButtons?: ReactElement<ViewProperties>[],
}

/**
 * Строка навигатора.
 * Пример использования:
 * <NavigatorBar
 *      LeftButton={button(IconType.BACK, navigator.pop)}
 *      Title={'Некоторый экран'}
 *      RightButton={button(IconType.OK, props.save)}
 * />
 */
export default class NavigatorBar extends Component<INavigatorBarProps, null> {

    renderButton = (button) => {
        // Нехорошо указывать key='key', но настоящего ключа у нас здесь нет,
        // и, учитывая, что элементов здесь немного, не такой уж страшный хак.
        return (
            <View key='key' style={[styles.centerContainer, styles.buttonContainer]}>
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
 * Типы иконок для строки навигатора.
 */
export enum IconType {
    BACK, OK
}

/**
 * Наименования компоненты Icon для для типов иконок в строке навигатора.
 */
const mapIconType = {
    [IconType.BACK]: 'chevron-left',
    [IconType.OK]: 'check'
}

/**
 * Кнопка для строки навигатора.
 *
 * @param type Строка из IconType.
 * @param callback
 */
export const button = (type: IconType, callback: () => void): ReactElement<ViewProperties> => {
    return (
        <TouchableHighlight onPress={callback}>
            <Icon name={mapIconType[type]} size={16} color={'#CCCCCC'}/>
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