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

/**
 * Строка путешествия в списке путешествий.
 */
export default class Trip extends Component {
    constructor(props) {
        super(props)
    }

    propTypes: {
        name: React.PropTypes.string
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Text style={styles.row}>{this.props.name}</Text>
            </View>
        )
    }
}