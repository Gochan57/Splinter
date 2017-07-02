import React, {Component} from 'react'
import {View, Text} from 'react-native'
import {Provider} from 'react-redux'
import { ThemeProvider } from 'react-native-material-ui'
import store from 'app/store'
import SNavigator from 'app/components/Common/Navigator/SNavigator'
// import TripsListScene from './Trip/TripsListScene'

export interface IProps {}
export interface IState {}

export default class App extends Component<IProps, IState> {
    // FIXME как-то использовать или же избавиться от ThemeProvider
    render() {
        return (
            <Provider store={store}>
                 <ThemeProvider uiTheme={null}>
                     <SNavigator
                         initialRoute={{ index: 0, component: <View><Text>HELLO</Text></View>}}
                     />
                 </ThemeProvider>
            </Provider>
        )
    }
}
