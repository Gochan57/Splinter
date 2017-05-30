import React, {Component} from 'react'
import {Provider} from 'react-redux'
import { ThemeProvider } from 'react-native-material-ui'
import store from 'app/store'
import SNavigator from 'app/components/Common/SNavigator'
import TripsListScene from './Trip/TripsListScene'

export default class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            top: 200,
            contentInset: 0,
        }
    }

    render() {
        return (
            <Provider store={store}>
                <ThemeProvider uiTheme={null}>
                    <SNavigator
                        initialRoute={{ index: 0, component: TripsListScene}}
                    />
                </ThemeProvider>
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