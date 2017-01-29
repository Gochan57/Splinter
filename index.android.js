import React, { Component } from 'react';
const Realm = require('realm')

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
    Navigator
} from 'react-native';
import App from './app/components/App'

class Person {}
Person.schema = {
    name: 'Person',
    primaryKey: 'name',
    properties: {
        name: 'string',
        age: {type: 'int', default: 0},
    },
};

export default class Splinter extends Component {

  componentWillMount() {
      this.setState({value: 'waiting...'})
      const realm = new Realm({schema: [Person]})
      let people = realm.objects('Person', 'age >= 17')
      realm.write(() => {
          savedPerson = realm.create('Person', {
              name: 'Hal Incandenza',
              age: 17,
          });
      });
      this.setState({value: people.length})
  }

  render() {

      return (
          <Text>{this.state.value}</Text>
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
