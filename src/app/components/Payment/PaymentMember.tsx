import React, {
    Component,
} from 'react'
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableHighlight,
    ViewStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import appStyles from 'app/styles'
import {
    round,
    toNumberNullable
} from 'app/utils/utils'

const commonStyles = appStyles.commonStyles

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
interface IProps {
    name: string,
    spent?: number,
    paid?: number,
    spentEditable?: boolean,
    paidEditable?: boolean,
    onSpentChanged?: (value: number) => void,
    onPaidChanged?: (value: number) => void,
    showPaidForAllCheck?: boolean,
    onPaidForAllChecked?: () => void,
    paidForAll?: boolean,
    spentPlaceholder?: string,
    paidPlaceholder?: string,
    style?: ViewStyle,
    customLabelStyle?: ViewStyle,
    customSpentStyle?: ViewStyle,
    customPaidStyle?: ViewStyle,
}

/**
 * Вводимое значение в поле "Потратил".
 * Вводимое значение в поле "Оплатил".
 */
interface IState {
    spentValue: string,
    paidValue: string,
}

/**
 * Представление компонента участника счета.
 */
export default class PaymentMember extends Component<IProps, IState> {

    static defaultProps: Partial<IProps> = {
        spentPlaceholder: 'Потратил',
        paidPlaceholder: 'Оплатил',
        showPaidForAllCheck: false
    }

    // Переопределение refs, чтобы typescript позволял вызвать blur() и focus() у элемента, полученного через refs.
    refs: {[key: string]: any} = {}

    constructor (props: IProps) {
        super(props)
        this.state = {
            spentValue: this.formatValue(props.spent),
            paidValue: this.formatValue(props.paid),
        }
    }

    /**
     * Форматирование числового значения для отображения в текстовом поле.
     */
    formatValue = (value: number): string => {
        if (value === undefined) return undefined
        if (value === null) return null
        return round(value, 2).toString()
    }

    /**
     * Снять фокус со всех инпутов.
     */
    blur() {
        if (this.refs.spentTextInput instanceof TextInput) {
            (this.refs.spentTextInput as TextInput).blur()
        }
        if (this.refs.spentTextInput instanceof TextInput) {
            (this.refs.paidTextInput as TextInput).blur()
        }

    }

    spentFocus() {
        if (this.refs.spentTextInput instanceof TextInput) {
            (this.refs.spentTextInput as TextInput).focus()
        }
    }

    componentWillReceiveProps (nextProps) {
        // Преобразуем числовые значения в отформатированные строковые.
        this.setState({
            spentValue: this.formatValue(nextProps.spent),
            paidValue: this.formatValue(nextProps.paid),
        })
    }

    renderPaidForAllCheck = () => {
        const {showPaidForAllCheck, onPaidForAllChecked, paidForAll} = this.props
        if (showPaidForAllCheck) {
            const color = paidForAll ? '#3333ff' : '#e6e6e6'
            return (
                <TouchableHighlight onPress={onPaidForAllChecked}>
                    <Icon name={'check'} size={16} color={color}/>
                </TouchableHighlight>
            )
        }
        return null
    }

    render() {
        const {name, spentEditable, paidEditable, onSpentChanged, onPaidChanged,
            spentPlaceholder, paidPlaceholder,
            style, customLabelStyle, customSpentStyle, customPaidStyle} = this.props
        return (
            <View style={[commonStyles.rowContainer, styles.container, style]}>
                <View style={[commonStyles.verticalCenter, commonStyles.flex]}>
                    <Text style={[styles.label, customLabelStyle]}>{name}</Text>
                </View>
                <View ref={'spentContainer'} style={[commonStyles.leftContainer, commonStyles.flex]}>
                    <TextInput
                        editable={spentEditable}
                        value={this.state.spentValue}
                        onChangeText={value => {this.setState({spentValue: value})}}
                        onEndEditing={e => {onSpentChanged(toNumberNullable(e.nativeEvent.text))}}
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
                        onEndEditing={e => {onPaidChanged(toNumberNullable(e.nativeEvent.text))}}
                        placeholder={paidPlaceholder}
                        style={[styles.input, customPaidStyle]}
                        ref={'paidTextInput'}
                    />
                </View>
                {this.renderPaidForAllCheck()}
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
