import React, {Component} from 'react'
import {View, TouchableHighlight, Text, Switch, StyleSheet} from 'react-native'

/**
 * Компонент Switch с отображаемым перед ним текстом.
 */
export default class Switcher extends Component {
    /**
     * text Текст перед Switch.
     * value Значение свитча.
     * onValueChange Коллбек на изменение свитча.
     */
    propTypes: {
        label: React.propTypes.string,
        value: React.propTypes.isRequired,
        onValueChange: React.propTypes.func.isRequired,
    }

    render() {
        const {label, value, onValueChange} = this.props
        return (
            <View style={styles.container}>
                <Text style={styles.label}>{label}</Text>
                <Switch
                    style={styles.switch}
                    onValueChange={onValueChange}
                    onTintColor="#FFCE73"
                    thumbTintColor="#FFA500"
                    tintColor="#FFBC40"
                    value={value} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    label: {
        fontSize: 20,
        textAlign: 'center'
    },
    switch: {

    }
})
