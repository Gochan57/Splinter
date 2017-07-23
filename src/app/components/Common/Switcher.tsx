import React, {Component} from 'react'
import {View, Text, Switch, StyleSheet} from 'react-native'
import appStyles from 'app/styles'

const commonStyles = appStyles.commonStyles

/**
 * text Текст перед Switch.
 * value Значение свитча.
 * onValueChange Коллбек на изменение свитча.
 */
interface IProps {
    label?: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
}

/**
 * Компонент Switch с отображаемым перед ним текстом.
 */
export default class Switcher extends Component<IProps, null> {
    render() {
        const {label, value, onValueChange} = this.props
        return (
            <View style={commonStyles.rowContainer}>
                <View style={commonStyles.verticalCenter}>
                    <Text style={styles.label}>{label}</Text>
                </View>
                    <Switch
                        onValueChange={onValueChange}
                        onTintColor='#FFCE73'
                        thumbTintColor='#FFA500'
                        tintColor='#F2EDE9'
                        value={value} />
            </View>
        )
    }
}

// Вот здесь typescript по-моему окончательно сошел с ума.
// Если убрать стиль WTF (который даже не используется), или если убрать из него поле justifyContent,
// то ts начинает гнусно ругаться после команды tsc.
const styles = StyleSheet.create({
    WTF: {
        justifyContent: 'center'
    },
    label: {
        textAlign: 'center',
        fontSize: 16
    }
})