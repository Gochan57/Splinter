import React, {Component} from 'react'
import {Navigator, NavigatorIOS, StyleSheet, TouchableHighlight, View, Text} from 'react-native'
import {config} from 'app/config'
import {OS} from 'app/constants'

/**
 * Расширение нативного навигатора
 * функция app/route/goTo служит для перехода между экранами
 */
export default class SNavigator extends Component {
    propTypes: {
        initialRoute: React.propTypes.object
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
        return <route.component navigator={navigator} {...route.passProps}/>
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
        const {rightBtnAction, renderRightButton} = route
        if(rightBtnAction) {
            const onPress = () => {
                route.rightBtnAction()
                navigator.pop()
            }
            return (
                <TouchableHighlight onPress={onPress}>
                    <Text>Done</Text>
                </TouchableHighlight>
            )
        }
        if(renderRightButton) {
            return renderRightButton;
        }
        return null;
    }

    // TODO Разместить по центру по горизонтали
    _renderTitle = (route, navigator, index, navState) => {
        return (
            <Text style={styles.title}>{route.title}</Text>
        )
    }
}

const styles = StyleSheet.create({
    navigationBar: {
        backgroundColor: 'dimgrey',
        height: 30,
        marginTop: (config.OS === OS.IOS ? 20 : 0)
    },
    scene: {
        marginTop: (config.OS === OS.IOS ? 50 : 30)
    },
    leftNavBtn: {
        marginTop: (config.OS === OS.IOS ? -10 : 0)
    },
    title: {
        marginTop: (config.OS === OS.IOS ? -15 : 30),
        marginLeft: 30,
        justifyContent: 'center'
    }
})

const trips = [
    {name: 'Sri Lanka', id: 1},
    {name: 'Kazan',  id: 2},
    {name: 'Morocco',  id: 3}
]