import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import TripList from './TripList'

export default class App extends Component {
    constructor(props) {
        super(props)
    }

    render(){
        const tripList = [{name: 'Шри Ланка'}, {name: 'Казань'}, {name: 'Марокко'}]
        return (
            <View>
                <TripList items={tripList}/>
            </View>
        )
    }
}