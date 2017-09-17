import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, Text, TextInput, TouchableHighlight} from 'react-native'
import stylePropType from 'react-style-proptype'
import Icon from 'react-native-vector-icons/FontAwesome'
import appStyles from 'app/styles'
import {round} from 'app/utils/utils'

const commonStyles = appStyles.commonStyles

/**
 * Представление компонента участника счета.
 */
export default class PaymentMember extends Component {
    /**
     * name Имя участника.
     * spent Потратил денег.
     * paid Оплатил денег.
     * spentEditable Можно ли менять число потраченных денег?
     * paidEditable Можно ли менять число заплаченных денег?
     * onSpentChanged Коллбэк на изменение значения потраченных денег.
     * onPaidChanged Коллбэк на изменение значения оплаченных денег.
     * showPaidForAllCheck Показывать ли галочку для выбора, что человек платил за всех.
     * onPaidForAllChecked Коллбэк на выбор участника счета, как оплатившего весь счет.
     * paidForAll Платил за всех.
     * style Кастомный стиль всей строки.
     * customLabelStyle Кастомный стиль текста слева.
     * customSpentStyle Кастомный стиль кол-ва потраченных денег.
     * customPaidStyle Кастомный стиль кол-ва заплаченных денег.
     */
    static propTypes = {
        name: PropTypes.string.isRequired,
        spent: PropTypes.number,
        paid: PropTypes.number,
        spentEditable: PropTypes.bool,
        paidEditable: PropTypes.bool,
        onSpentChanged: PropTypes.func.isRequired,
        onPaidChanged: PropTypes.func.isRequired,
        showPaidForAllCheck: PropTypes.bool,
        onPaidForAllChecked: PropTypes.func,
        paidForAll: PropTypes.bool,
        spentPlaceholder: PropTypes.string,
        paidPlaceholder: PropTypes.string,
        style: stylePropType,
        customLabelStyle: stylePropType,
        customSpentStyle: stylePropType,
        customPaidStyle: stylePropType,
    }

    static defaultProps = {
        spentPlaceholder: 'Потратил',
        paidPlaceholder: 'Оплатил',
        showPaidForAllCheck: false
    }

    constructor (props) {
        super(props)
        this.state = {
            spentValue: this.formatValue(props.spent),
            paidValue: this.formatValue(props.paid),
        }
    }

    formatValue = (value) => {
        return value !== undefined ? round(value, 2).toString() : undefined
    }

    /**
     * Снять фокус со всех инпутов.
     */
    blur() {
        this.refs.spentTextInput.blur()
        this.refs.paidTextInput.blur()
    }

    spentFocus() {
        this.refs.spentTextInput.focus()
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            spentValue: this.formatValue(nextProps.spent),
            paidValue: this.formatValue(nextProps.paid),
        })
    }

    render() {
        const {name, spent, paid,
            spentEditable, paidEditable, onSpentChanged, onPaidChanged,
            showPaidForAllCheck, onPaidForAllChecked, paidForAll,
            spentPlaceholder, paidPlaceholder,
            style, customLabelStyle, customSpentStyle, customPaidStyle} = this.props
        let paidForAllCheck = null
        if (showPaidForAllCheck) {
            const color = paidForAll ? '#3333ff' : '#e6e6e6'
            paidForAllCheck = (
                <TouchableHighlight onPress={onPaidForAllChecked}>
                    <Icon name={'check'} size={16} color={color}/>
                </TouchableHighlight>
            )
        }
        return (
            <View style={[commonStyles.rowContainer, styles.container, style]}>
                <View style={[commonStyles.verticalAlign, commonStyles.flex]}>
                    <Text style={[styles.label, customLabelStyle]}>{name}</Text>
                </View>
                <View ref={'spentContainer'} style={[commonStyles.leftContainer, commonStyles.flex]}>
                    <TextInput
                        editable={spentEditable}
                        value={this.state.spentValue}
                        onChangeText={value => {this.setState({spentValue: value})}}
                        onEndEditing={e => {onSpentChanged(e.nativeEvent.text)}}
                        placeholder={spentPlaceholder}
                        style={[styles.input, customSpentStyle]}
                        ref={'spentTextInput'}
                    />
                </View>
                <View ref={'paidContainer'} style={[commonStyles.leftContainer, commonStyles.flex]}>
                    <TextInput
                        editable={paidEditable}
                        value={this.state.paidValue}
                        onChangeText={value => {this.setState({paidValue: value})}}
                        onEndEditing={e => {onPaidChanged(e.nativeEvent.text)}}
                        placeholder={paidPlaceholder}
                        style={[styles.input, customPaidStyle]}
                        ref={'paidTextInput'}
                    />
                </View>
                <View>
                    {paidForAllCheck}
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
        textAlign: 'left',
    },
    input: {
        height: 40,
        width: 100
    }
})
