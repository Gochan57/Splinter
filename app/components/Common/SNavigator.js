import React, {Component} from 'react'
import {Navigator, NavigatorIOS, TouchableHighlight, View, Text} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import appStyles from 'app/styles'

const styles =  appStyles.navigatorStyles

/**
 * Расширение нативного навигатора
 */
export default class SNavigator extends Component {
    /**
     * initialRoute - Начальный экран навигатора, ожидается {index, component, passProps}
     */
    propTypes: {
        initialRoute: React.propTypes.object,
    }

    render() {
        const {initialRoute} = this.props;
        return (
            <Navigator
                initialRoute={initialRoute}
                renderScene={this._renderScene}
                navigationBar={
                    <Navigator.NavigationBar
                        routeMapper={{
                            LeftButton: this._renderLeftButton,
                            RightButton: this._renderRightButton,
                            Title: this._renderTitle,
                        }}
                        style={styles.navigationBar}
                    />
                }
                sceneStyle={styles.scene}
            />
        )
    }

    _renderScene = (route, navigator) => {
        return <route.component route={route} navigator={navigator} {...route.passProps}/>
    }

    _renderLeftButton = (route, navigator, index, navState) => {
        if (route.index === 0) {
            return null
        } else {
            return (
                <View style={styles.leftNavBtn}>
                    <TouchableHighlight onPress={() => navigator.pop()}>
                        <Icon name="chevron-left" size={16} color="#CCCCCC"/>
                    </TouchableHighlight>
                </View>
            )
        }
    }

    _renderRightButton = (route, navigator, index, navState) => {
        const {renderRightButton, rightBtnOK} = route
        if(renderRightButton) {
            return (
                <View style={styles.rightNavBtn}>
                    {renderRightButton}
                </View>
            )
        }
        if(rightBtnOK) {
            return (
                <View style={styles.rightNavBtn}>
                    <TouchableHighlight onPress={route.rightBtnAction}>
                        <Icon name="check" size={16} color="#CCCCCC"/>
                    </TouchableHighlight>
                </View>
            )
        }

        return null;
    }

    // TODO Разместить по центру по горизонтали
    _renderTitle = (route, navigator, index, navState) => {
        const title = route.title || route.component.title || 'Notitle'
        return (
            <Text style={styles.title}>{title}</Text>
        )
    }
}

/**
 * Функция для перехода на другие экраны.
 *
 * @param navigator Объект навигатора.
 * @param component Компонент, который будет рендерится на странице с этим навигатором.
 * @param props Пропсы, которые передадутся в компонент.
 * @param title Заголовок в строке навигатора. Если не указан, то будет взят из статичного поля title компонента.
 * Если нет там, то отобразится Notitle.
 * @param {Component} renderRightButton - Компонент правой кнопки, если заранее известен.
 * @param {boolean} rightBtnOK - Правая кнопка будет OK. Действие на кнопке нужно задать в поле route.rightBtnAction на компоненте,
 * который рендерится с этим навигатором (например в componentWillMount).
 */
export function goTo(params) {
    const {navigator, component, props, title, renderRightButton, rightBtnOK} = params
    navigator.push({
        component,
        title,
        passProps: props,
        renderRightButton,
        rightBtnOK,
    })
}


