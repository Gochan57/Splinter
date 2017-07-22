import React, {
    Component,
    ComponentClass,
    ReactElement
} from 'react'
import {
    Navigator,
    NavigatorStatic,
    Route,
    View,
    ViewProperties
} from 'react-native'
import appStyles from 'app/styles'

const styles =  appStyles.navigatorStyles

interface IRoute extends Route {
    component: ComponentClass<any>
}

export interface ISNavigatorProps {
    initialRoute: IRoute
}

/**
 * Расширение нативного навигатора
 */
export default class SNavigator extends Component<ISNavigatorProps, any> {

    render() {
        const {initialRoute} = this.props
        return (
            <Navigator
                initialRoute={initialRoute}
                renderScene={this._renderScene}
            />
        )
    }

    _renderScene = (route: IRoute, navigator: NavigatorStatic): ReactElement<ViewProperties> => {
        return (
            <route.component navigator={navigator} {...route.passProps}/>
        )
    }
}

/**
 * Функция для перехода на другие экраны.
 *
 * navigator Объект навигатора.
 * component Компонент (экран), на который мы переходим.
 * props Пропсы, которые передадутся в компонент.
 */
export function goTo(navigator: NavigatorStatic, component: ComponentClass<ViewProperties>, props?: Object) {
    navigator.push({
        component,
        passProps: props,
    })
}
