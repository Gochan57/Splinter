import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator
} from 'react-native';

import {initDB} from './app/services/db'
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

AppRegistry.registerComponent('Splinter', () => Splinter);
