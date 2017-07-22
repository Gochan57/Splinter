import React, {Component} from 'react'
import {Provider} from 'react-redux'
import { ThemeProvider } from 'react-native-material-ui'
import store from 'app/store'
import SNavigator from 'app/components/Common/Navigator/SNavigator'
import TripsListScene from './Trip/TripsListScene'

interface IProps {}
interface IState {}

export default class App extends Component<IProps, IState> {
    // FIXME как-то использовать или же избавиться от ThemeProvider
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
