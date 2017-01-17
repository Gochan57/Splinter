import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native'

export default class PaymentItem extends Component {
    constructor(props) {
        super(props)
    }

    propTypes: {
        id: React.PropTypes.string,
        name: React.PropTypes.array,
        onPress: React.PropTypes.func,
    }

    render() {
        return (
            <TouchableHighlight onPress={this.props.onPress}>
                <Text style={styles.item}>
                    {this.props.name}
                </Text>
            </TouchableHighlight>
        )
    }
}

var styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#F6F6F6',
    }
})