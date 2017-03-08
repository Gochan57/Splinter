import React, {Component} from 'react'
import {config} from 'app/config'
import {OS} from 'app/constants'
import SNavigator from 'app/components/Common/SNavigator'
import TripsScene from './Trip/TripsScene'

export default class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <SNavigator
                initialRoute={{ index: 0, component: TripsScene, passProps: {items: trips}}}
            />
        )
    }
}

const trips = {
    '1': {name: 'Sri Lanka'},
    '2': {name: 'Kazan'},
    '3': {name: 'Morocco'},
}

const payments = [
    {date: '01.02.2016', name: 'Cafe', id: '1'},
    {date: '01.02.2016', name: 'Market', id: '2'},
    {date: '01.02.2016', name: 'Supermarket', id: '3'},
    {date: '02.02.2016', name: 'Fruits', id: '4'},
    {date: '03.02.2016', name: 'Taxi to home', id: '5'},
    {date: '03.02.2016', name: 'Alcohol', id: '6'},
];