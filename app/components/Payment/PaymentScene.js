import React, {Component} from 'react'
import {ActivityIndicator, StyleSheet, View, Text, TextInput, TouchableHighlight, SwipeableListView} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {filter, find, forEach, pickBy, reduce} from 'lodash'

import {
    startCreatingNewPayment,
    startUpdatingPayment,
    changePaymentName,
    spentEquallySwitched,
    paidOneSwitched,
    changeSumOnPayment,
    paidForAllChecked,
    removeMemberFromPayment,
    changeMemberSpentOnPayment,
    changeMemberPaidOnPayment,
    updatePayment,
    cancelUpdatingPayment,
} from 'app/action/payments'
import {toArrayWithKeys, toNumber, toNumberNullable, round} from 'app/utils/utils'
import {TEMPORARY_ID} from 'app/constants'
import appStyles from 'app/styles'

import WideInput from 'app/components/Common/WideInput'
import Switcher from 'app/components/Common/Switcher'
import RemovableListView from 'app/components/Common/RemovableListView'

import PaymentMember from './PaymentMember'

const commonStyles = appStyles.commonStyles

const TOTAL_ROW_REF = 'totalRow'

/**
 * Экран просмотра/добавления/редактирования счета.
 */
class PaymentScene extends Component {

    static defaultProps: {
        loading: false,
        name: '',
        spentEqually: false,
        paidOne: false,
        sum: null,
        data: [],
    }

    /**
     * tripId Идентификатор путешествия.
     * paymentId Идентификатор счета.
     * loading Страница загружается.
     * name Название счета.
     * spentEqually Потратили одинаково?
     * paidOne Платил один?
     * sum Общая сумма счета.
     * members Участника счета.
     */
    static propTypes = {
        tripId: React.PropTypes.string.isRequired,
        paymentId: React.PropTypes.string,
        loading: React.PropTypes.bool,
        name: React.PropTypes.string,
        spentEqually: React.PropTypes.bool,
        paidOne: React.PropTypes.bool,
        sum: React.PropTypes.number,
        members: React.PropTypes.array,
    }

    constructor (props) {
        super(props)
        this.state = {
            test: ''
        }
    }

    refFor(key) {
        return `ref_${key}`
    }

    /**
     * Снять фокус со всех инпутов.
     */
    endEditingAllInputs = () => {
        const {members} = this.props
        this.refs.list.refs[this.refFor(TOTAL_ROW_REF)].blur()
        forEach(members, member => {
            this.refs.list.refs[this.refFor(member.key)].blur()
        })
    }

    componentWillMount () {
        const {tripId, paymentId} = this.props
        if (paymentId) {
            this.props.startUpdatingPayment(tripId, paymentId)
        }
        else {
            this.props.startCreatingNewPayment(tripId)
        }
        // Задаем действие кнопке "Сохранить"
        this.props.route.rightBtnAction = () => {
            this.props.updatePayment(tripId)
            this.props.navigator.pop()
        }
    }

    componentWillUnmount () {
        this.props.cancelUpdatingPayment()
    }

    renderMemberRow = (rowData) => {
        if (rowData.key === TOTAL_ROW_REF) {
            // Верхняя строка с общим счетом
            return (
                <PaymentMember
                    name={rowData.name}
                    spent={toNumberNullable(rowData.spent)}
                    paid={toNumberNullable(rowData.paid)}
                    spentEditable={this.props.spentEqually}
                    paidEditable={false}
                    onSpentChanged={this.props.changeSumOnPayment}
                    onPaidChanged={() => {}}
                    spentPlaceholder={null}
                    paidPlaceholder={null}
                    style={styles.totalRowStyle}
                    customLabelStyle={styles.totalRowLabelStyle}
                    customSpentStyle={styles.totalRowSpentStyle}
                    customPaidStyle={styles.totalRowPaidStyle}
                    key={rowData.key}
                    ref={this.refFor(rowData.key)}/>
            )
        }
        return (
            <PaymentMember
                name={rowData.name}
                spent={toNumberNullable(rowData.spent)}
                paid={toNumberNullable(rowData.paid)}
                spentEditable={!this.props.spentEqually}
                paidEditable={!this.props.paidOne}
                onSpentChanged={value => {this.props.changeMemberSpentOnPayment(rowData.personId, value)}}
                onPaidChanged={value => {this.props.changeMemberPaidOnPayment(rowData.personId, value)}}
                showPaidForAllCheck={this.props.paidOne}
                onPaidForAllChecked={() => this.props.paidForAllChecked(rowData.personId)}
                paidForAll={rowData.paidForAll}
                key={rowData.key}
                ref={this.refFor(rowData.key)}/>
        )
    }

    render() {
        const {tripId, paymentId, loading, name, spentEqually, paidOne, sum, totalRow, members} = this.props

        if (loading) {
            return <ActivityIndicator />
        }
        const data = [totalRow, ...members]
        return (
            <View ref={'mainView'}>
                <WideInput
                    placeholder='Название'
                    onChangeText={text => {this.props.changePaymentName(text)}}
                    value={name}
                />
                <Switcher
                    label={'Потратили поровну'}
                    onValueChange={(value) => {
                        this.endEditingAllInputs()
                        this.props.spentEquallySwitched(value)
                        this.refs.list.refs[this.refFor(TOTAL_ROW_REF)].spentFocus()
                    }}
                    value={spentEqually} />
                <Switcher
                    label={'Платил один'}
                    onValueChange={(value) => {
                        this.endEditingAllInputs()
                        this.props.paidOneSwitched(value)
                    }}
                    value={paidOne} />
                <RemovableListView
                    ref={'list'}
                    data={data}
                    renderRow={this.renderMemberRow}
                    removeRow={(personId) => this.props.removeMemberFromPayment(tripId, paymentId, personId)} />
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const {tripId} = ownProps
    // Из списка всех счетов выберем редактируемый счет.
    let payment = state.payments[TEMPORARY_ID]
    if(!payment) {
        return {loading: true}
    }
    // Все участники путешествия
    const people = state.trips[tripId].people
    // Добавим к каждому member поле key (этого требует элемент RemovableListView) и name
    forEach(payment.members, member => {
        member.key = member.personId
        member.name = people[member.personId].name
    })
    // Вычислим строку Итого
    const totalPaid = reduce(payment.members, (sum, member) => sum + toNumber(member.paid), 0) // общее число потраченных денег
    const remainsToPay = totalPaid - payment.sum
    const totalRow = {name: 'Общий счет', spent: payment.sum, paid: remainsToPay ? remainsToPay : undefined, key: TOTAL_ROW_REF}

    const {paymentId, name, spentEqually, paidOne, sum, members} = payment
    return {loading: false, tripId, paymentId, name, spentEqually, paidOne, sum: toNumberNullable(sum), totalRow, members}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        startCreatingNewPayment,
        startUpdatingPayment,
        changePaymentName,
        spentEquallySwitched,
        paidOneSwitched,
        changeSumOnPayment,
        paidForAllChecked,
        removeMemberFromPayment,
        changeMemberSpentOnPayment,
        changeMemberPaidOnPayment,
        updatePayment,
        cancelUpdatingPayment,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentScene)

const styles = StyleSheet.create({
    totalRowStyle: {
        backgroundColor: '#FFCE73'
    },
    totalRowLabelStyle: {
        fontWeight: 'bold'
    },
    totalRowSpentStyle: {
        fontWeight: 'bold',
    },
    totalRowPaidStyle: {
        fontWeight: 'bold',
        fontSize: 12,
        color: 'red'
    },
})
