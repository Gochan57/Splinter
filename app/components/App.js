import React, {Component} from 'react'
import {Navigator, StyleSheet, View, Text} from 'react-native'
import TripsScene from './Trip/TripsScene'
import TripItem from './Trip/TripItem'

export default class App extends Component {
    constructor(props) {
        super(props)
    }

    render(){
        return (
            <Navigator
                initialRoute={{ index: 0, component: TripsScene, passProps: {items: trips} }}
                renderScene={this._renderScene}
            />
        )
    }

    _renderScene = (route, navigator) => {
        return <route.component navigator={navigator} {...route.passProps}/>
    }
}

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