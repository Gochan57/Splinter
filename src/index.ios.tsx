import React, { Component } from 'react';
import {
    AppRegistry,
} from 'react-native';

import {initDB} from './app/services/db'
import App from './app/components/App'

let SQLite = require('react-native-sqlite-storage');

export interface IProps {}
export interface IState {}

export default class Splinter extends Component<IProps, IState> {

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
