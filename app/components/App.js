import React, {Component} from 'react'
import {Navigator, StyleSheet, TouchableHighlight, View, Text} from 'react-native'
import TripsScene from './Trip/TripsScene'

export default class App extends Component {
    constructor(props) {
        super(props)
    }

    render(){
        return (
            <Navigator
                initialRoute={{ index: 0, component: TripsScene, passProps: {items: trips} }}
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
                <TouchableHighlight onPress={() => navigator.pop()}>
                    <Text>Back</Text>
                </TouchableHighlight>
            );
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
            <Text style={styles.title}>{'Привет'}</Text>
        )
    }
}

const styles = StyleSheet.create({
    navigationBar: {
        backgroundColor: 'gainsboro',
        height: 30
    },
    scene: {
        marginTop: 30
    },
    title: {
        marginTop: 30,
        marginLeft: 30,
        justifyContent: 'center',
    }
})

const trips = [
    {name: 'Sri Lanka', id: 1},
    {name: 'Kazan',  id: 2},
    {name: 'Morocco',  id: 3}
]

// <PaymentsPage name={'Sri Lanka'} payments={payments}/>
const payments = [
    {date: '01.02.2016', name: 'Cafe', id: '1'},
    {date: '01.02.2016', name: 'Market', id: '2'},
    {date: '01.02.2016', name: 'Supermarket', id: '3'},
    {date: '02.02.2016', name: 'Fruits', id: '4'},
    {date: '03.02.2016', name: 'Taxi to home', id: '5'},
    {date: '03.02.2016', name: 'Alcohol', id: '6'},
];