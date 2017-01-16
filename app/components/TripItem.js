import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'

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

export default class TripItem extends Component {
    propTypes: {
        name: React.PropTypes.string
    }

    constructor(props) {
        super(props)
    }

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.row}>{this.props.name}</Text>
        </View>
    )
}