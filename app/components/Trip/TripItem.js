import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native'

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
    constructor(props) {
        super(props)
    }

    propTypes: {
        name: React.PropTypes.string,
        onPress: React.PropTypes.func,
    }

    render() {
        const {name, onPress} = this.props
        return (
            <TouchableHighlight onPress={onPress}>
                <View style={styles.row}>
                    <Text style={styles.text}>
                        {name}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }
}