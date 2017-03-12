import React, {Component} from 'react'
import {Navigator, NavigatorIOS, TouchableHighlight, View, Text} from 'react-native'
import appStyles from 'app/styles'

const styles =  appStyles.navigatorStyles

/**
 * Расширение нативного навигатора
 * функция app/route/goTo служит для перехода между экранами
 */
export default class SNavigator extends Component {
    /**
     * initialRoute - Начальный экран навигатора, ожидается {index, component, passProps}
     * scenes - Наименования сцен в формате {[component]: title} (см. app/route/scenes)
     */
    propTypes: {
        initialRoute: React.propTypes.object,
        scenes: React.propTypes.object,
    }

    render(){
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
                        <Text>Back</Text>
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
                        <Text>OK</Text>
                    </TouchableHighlight>
                </View>
            )
        }

        return null;
    }

    // TODO Разместить по центру по горизонтали
    _renderTitle = (route, navigator, index, navState) => {
        const {scenes} = this.props;
        const title = route.title || scenes[route.component].title || 'Notitle'
        return (
            <Text style={styles.title}>{title}</Text>
        )
    }
}


