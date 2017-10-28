import React, {
    Component,
    ComponentClass,
    ReactElement
} from 'react'
import {
    Navigator,
    NavigatorStatic,
    Route,
    ViewProperties
} from 'react-native'

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
