import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import PaymentsPage from './Payment/PaymentsPage'
import TripsList from './Trip/TripsList'
import AddTrip from './Trip/AddTrip'

export default class App extends Component {
    constructor(props) {
        super(props)
    }

    render(){
        return (
            <View>
                <Text>HELLO</Text>
                <TripsList items={tripsList}/>
                <AddTrip name='Add new Trip'/>
            </View>
        )
    }
}

const tripList = [{name: 'Sri Lanka'}, {name: 'Kazan'}, {name: 'Morocco'}]

// <PaymentsPage name={'Sri Lanka'} payments={payments}/>
const payments = [
    {date: '01.02.2016', name: 'Cafe', id: '1'},
    {date: '01.02.2016', name: 'Market', id: '2'},
    {date: '01.02.2016', name: 'Supermarket', id: '3'},
    {date: '02.02.2016', name: 'Fruits', id: '4'},
    {date: '03.02.2016', name: 'Taxi to home', id: '5'},
    {date: '03.02.2016', name: 'Alcohol', id: '6'},
];