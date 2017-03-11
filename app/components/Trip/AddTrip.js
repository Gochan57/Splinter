import React, {Component} from 'react'
import {StyleSheet, TouchableHighlight, View, Text} from 'react-native'
import {goTo} from 'app/route'
import TripItem from './Trip'
import CreateNewTrip from './CreateNewTrip'

export default class AddTrip extends Component {

    propTypes: {
        navigator: React.propTypes.object,
        route: React.propTypes.object,
    }

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <TouchableHighlight onPress={this._onPress}>
                    <Text style={styles.row}>Add new trip</Text>
                </TouchableHighlight>
            </View>
        )
    }

    _onPress = () => {
        const {navigator} = this.props
        goTo({
            navigator,
            component: CreateNewTrip,
            rightBtnOK: true
        })
    }
}

const styles = StyleSheet.create({
    row: {
        height: 40,
        padding: 10,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 3,
    }
})