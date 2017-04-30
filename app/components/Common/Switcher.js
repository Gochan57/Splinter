import React, {Component} from 'react'
import {View, TouchableHighlight, Text, Switch, StyleSheet} from 'react-native'
import appStyles from 'app/styles'

const commonStyles = appStyles.commonStyles

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
            <View style={commonStyles.rowContainer}>
                <View style={commonStyles.verticalAlign}>
                    <Text style={styles.label}>{label}</Text>
                </View>
                    <Switch
                        style={styles.switch}
                        onValueChange={onValueChange}
                        onTintColor="#FFCE73"
                        thumbTintColor="#FFA500"
                        tintColor="#F2EDE9"
                        value={value} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    label: {
        fontSize: 18,
        textAlign: 'center',
    },
})
