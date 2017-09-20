import React, { Component } from 'react';
import { AppRegistry, } from 'react-native';
import { initDB } from './artifacts/app/services/db';
import App from './artifacts/app/components/App';
let SQLite = require('react-native-sqlite-storage');
export default class Splinter extends Component {
    componentWillMount() {
        initDB(SQLite);
    }
    render() {
        return (React.createElement(App, null));
    }
}
AppRegistry.registerComponent('Splinter', () => Splinter);
//# sourceMappingURL=index.android.js.map