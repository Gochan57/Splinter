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
     * spentEqually Все потратили одинаково денег?
     * paidOne Платил только один участник?
     * paidForAll За всех платил этот участник?
     * onSpentChanged Коллбэк на изменение значения потраченных денег.
     * onPaidChanged Коллбэк на изменение значения оплаченных денег.
     * radioButtonClass Класс группы радио-баттонов, отмечающих, кто оплатил весь счет.
     */
    static propTypes = {
        included: PropTypes.bool,
        name: PropTypes.string.isRequired,
        spent: PropTypes.number,
        paid: PropTypes.number,
        spentEqually: PropTypes.bool,
        paidOne: PropTypes.bool,
        paidForAll: PropTypes.bool,
        onSpentChanged: PropTypes.func.isRequired,
        onPaidChanged: PropTypes.func.isRequired,
        radioButtonClass: PropTypes.string.isRequired,
    }

    render() {
        const {enabled, name, spent, paid, spentEqually, paidOne, onSpentChanged, onPaidChanged, radioButtonClass,} = this.props
        return (
            <View style={[commonStyles.rowContainer, styles.container]}>
                <View style={commonStyles.verticalAlign}>
                    <Text style={styles.label}>{name}</Text>
                </View>
                <View style={commonStyles.verticalAlign}>
                    <TextInput
                        editable={!spentEqually}
                        onEndEditing={onSpentChanged}
                        placeholder={'Потратил'}
                        value={spent !== undefined ? spent.toString() : undefined}
                        style={styles.input}
                        />
                </View>
                <View style={commonStyles.verticalAlign}>
                    <TextInput
                        editable={!paidOne}
                        onEndEditing={onPaidChanged}
                        placeholder={'Оплатил'}
                        value={paid !== undefined ? paid.toString() : undefined}
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
        height: 40,
        width: 100
    }
})
