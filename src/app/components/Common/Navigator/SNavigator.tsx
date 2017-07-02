import React, {Component} from 'react'
import {Navigator} from 'react-native'
import appStyles from 'app/styles'

const styles =  appStyles.navigatorStyles

export interface IProps {}

/**
 * Расширение нативного навигатора
 */
export default class SNavigator extends Component<IProps, void> {
    /**
     * initialRoute - Начальный экран навигатора, ожидается {index, component, passProps}
     */
    propTypes: {
        initialRoute: React.PropTypes.object,
    }

    render() {
        const {initialRoute} = this.props;
        return (
            <Navigator
                initialRoute={initialRoute}
                renderScene={this._renderScene}
                sceneStyle={styles.scene}
            />
        )
    }

    _renderScene = (route, navigator) => {
        return <route.component route={route} navigator={navigator} {...route.passProps}/>
    }
}

/**
 * Функция для перехода на другие экраны.
 *
 * @param navigator Объект навигатора.
 * @param component Компонент, который будет рендерится на странице с этим навигатором.
 * @param props Пропсы, которые передадутся в компонент.
 */
export function goTo(params) {
    const {navigator, component, props} = params
    navigator.push({
        component,
        passProps: props,
    })
}
