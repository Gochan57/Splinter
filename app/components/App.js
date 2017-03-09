import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {config} from 'app/config'
import {OS} from 'app/constants'
import {scenes} from 'app/route'
import store from 'app/store'
import SNavigator from 'app/components/Common/SNavigator'
import TripsScene from './Trip/TripsScene'

export default class App extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Provider store={store}>
                <SNavigator
                    initialRoute={{ index: 0, component: TripsScene}}
                    scenes={scenes}
                />
            </Provider>
        )
    }
}

const payments = [
    {date: '01.02.2016', name: 'Cafe', id: '1'},
    {date: '01.02.2016', name: 'Market', id: '2'},
    {date: '01.02.2016', name: 'Supermarket', id: '3'},
    {date: '02.02.2016', name: 'Fruits', id: '4'},
    {date: '03.02.2016', name: 'Taxi to home', id: '5'},
    {date: '03.02.2016', name: 'Alcohol', id: '6'},
]