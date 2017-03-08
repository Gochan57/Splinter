import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator
} from 'react-native';

import {initDB} from './app/utils/db'
import App from './app/components/App'

let SQLite = require('react-native-sqlite-storage');

export default class Splinter extends Component {

    componentWillMount() {
        initDB(SQLite)
    }

    render() {
        return (
            <App/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('Splinter', () => Splinter);
