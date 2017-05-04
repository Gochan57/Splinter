import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, Text, TextInput, TouchableHighlight} from 'react-native'
import appStyles from 'app/styles'

const commonStyles = appStyles.commonStyles

/**
 * Представление компонента участника счета.
 * Рендерится в компоненте PaymentMember.
 */
export default class PaymentMemberView extends Component {
    /**
     * included Участвует в счете.
     * name Имя участника.
     * spent Потратил денег.
     * paid Оплатил денег.
     * paidOne Платил только этот участник.
     * onSpentChanged Коллбэк на изменение значения потраченных денег.
     * onPaidChanged Коллбэк на изменение значения оплаченных денег.
     * radioButtonClass Класс группы радио-баттонов, отмечающих, кто оплатил весь счет.
     */
    static propTypes = {
        included: PropTypes.bool,
        name: PropTypes.string.isRequired,
        spent: PropTypes.number,
        paid: PropTypes.number,
        paidOne: PropTypes.bool,
        onSpentChanged: PropTypes.func.isRequired,
        onPaidChanged: PropTypes.func.isRequired,
        radioButtonClass: PropTypes.string.isRequired,
    }

    render() {
        const {enabled, name, spent, paidOne, onSpentChanged, onPaidChanged, radioButtonClass,} = this.props
        return (
            <View style={[commonStyles.rowContainer, styles.container]}>
                <View style={commonStyles.verticalAlign}>
                    <Text style={styles.label}>{name}</Text>
                </View>
                <View style={commonStyles.verticalAlign}>
                    <TextInput
                        onChangeText={this.onSpentChanged}
                        placeholder={'Оплатил'}
                        value={spent}
                        style={styles.input}
                        />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        paddingLeft: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#5DCFC3'
    },
    label: {
        fontSize: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: 'red',
        width: 100
    }
})
