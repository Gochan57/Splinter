import React, {Component, PropTypes} from 'react'
import {ActivityIndicator, Modal, StyleSheet, View, Text, TextInput, TouchableHighlight, SwipeableListView} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {
    startCreatingNewPayment,
    startUpdatingPayment,
    changePaymentName,
    spentEquallySwitched,
    paidOneSwitched,
    changeSumOnPayment,
    paidForAllChecked,
    setMembersOfPayment,
    removeMemberFromPayment,
    changeMemberSpentOnPayment,
    changeMemberPaidOnPayment,
    updatePayment,
    cancelUpdatingPayment,
} from 'app/action/payments'
import {toNumber, toNumberNullable} from 'app/utils/utils'
import {TEMPORARY_ID} from 'app/constants'
import appStyles from 'app/styles'

import SNavigatorBar, {IconTypes, button} from 'app/components/Common/Navigator/SNavigatorBar'
import WideInput from 'app/components/Common/WideInput'
import WideButton from 'app/components/Common/WideButton'
import Switcher from 'app/components/Common/Switcher'
import RemovableListView from 'app/components/Common/RemovableListView'

import PaymentMember from './PaymentMember'
import MembersListScene from '../Member/MembersListScene'

import * as _ from 'lodash'

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
     * tripMembers Участники путешествия.
     * navigator Навигатор для перехода на другие экраны.
     */
    static propTypes = {
        tripId: PropTypes.string.isRequired,
        paymentId: PropTypes.string,
        loading: PropTypes.bool,
        name: PropTypes.string,
        spentEqually: PropTypes.bool,
        paidOne: PropTypes.bool,
        sum: PropTypes.number,
        members: PropTypes.array,
        tripMembers: PropTypes.array,
        navigator: PropTypes.object,
    }

    /**
     * chooseMembersModalVisible Отображать модальное окно с выбором участников счета.
     */
    constructor (props) {
        super(props)
        this.state = {
            chooseMembersModalVisible: false
        }
    }

    /**
     * Генератор ref по key для строк с участниками счета.
     * @param key
     */
    refFor(key) {
        return `ref_${key}`
    }

    /**
     * Снять фокус со всех инпутов.
     */
    endEditingAllInputs = () => {
        const {members} = this.props
        this.refs.list.refs[this.refFor(TOTAL_ROW_REF)].blur()
        _.forEach(members, member => {
            this.refs.list.refs[this.refFor(member.key)].blur()
        })
    }

    /**
     * Показать/скрыть модальное окно с выбором участников счета.
     * @param visible
     */
    setChooseMembersModalVisible = (visible) => {
        this.setState({chooseMembersModalVisible: visible})
    }

    componentWillMount () {
        const {tripId, paymentId} = this.props
        if (paymentId) {
            this.props.startUpdatingPayment(tripId, paymentId)
        }
        else {
            this.props.startCreatingNewPayment(tripId)
        }
    }

    componentWillUnmount () {
        this.props.cancelUpdatingPayment()
    }

    renderNavigatorBar = () => {
        const {tripId, name, navigator} = this.props
        const leftButton = button(IconTypes.back, () => {navigator.pop()})
        const title = name || 'Новый счет'
        const rightButton = button(IconTypes.OK, () => {
            this.props.updatePayment(tripId)
            this.props.navigator.pop()
        })
        return (
            <SNavigatorBar
                LeftButton={leftButton}
                Title={title}
                RightButton={rightButton}
            />
        )
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

    /**
     * Рендерим модальное окно для выбора участников счета.
     */
    renderChooseMembersModal = () => {
        // Добавляем к каждому участнику путешествия флаг selected - выбран ли он участником этого счета
        const members = this.props.tripMembers.map(member => ({
                ...member,
                selected: _.some(this.props.members, {personId: member.personId})
            })
        )
        const onChosenMembers = (personIdList) => {
            this.props.setMembersOfPayment(personIdList)
            this.setChooseMembersModalVisible(false)
        }
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.chooseMembersModalVisible}
                onRequestClose={() => {}}
                onPress={() => {this.setChooseMembersModalVisible(false)}}>
                <TouchableHighlight
                    style={[commonStyles.flex, commonStyles.centerContainer]}
                    onPress={() => {this.setChooseMembersModalVisible(false)}}>
                    <View style={styles.chooseMembersModalStyle}>
                        <MembersListScene members={members} onFinish={onChosenMembers}/>
                    </View>
                </TouchableHighlight>
            </Modal>
        )
    }

    render() {
        const {tripId, paymentId, loading, name, spentEqually, paidOne, sum, totalRow, members} = this.props

        if (loading) {
            return <ActivityIndicator />
        }
        const data = [totalRow, ...members]
        return (
            <View style={commonStyles.flex} ref={'mainView'}>
                {this.renderNavigatorBar()}
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
                <View style={[commonStyles.flex, commonStyles.bottomContainer]}>
                    <WideButton
                        text={'Изменить участников'}
                        onPress={() => {this.setChooseMembersModalVisible(true)}}/>
                </View>
                {this.renderChooseMembersModal()}
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
    _.forEach(payment.members, member => {
        member.key = member.personId
        member.name = people[member.personId].name
    })
    const tripMembers = _.values(people)
    // Вычислим строку Итого
    const totalPaid = _.reduce(payment.members, (sum, member) => sum + toNumber(member.paid), 0) // общее число потраченных денег
    const remainsToPay = totalPaid - payment.sum
    const totalRow = {name: 'Общий счет', spent: payment.sum, paid: remainsToPay ? remainsToPay : undefined, key: TOTAL_ROW_REF}

    const {paymentId, name, spentEqually, paidOne, sum, members} = payment
    return {loading: false, tripId, paymentId, name, spentEqually, paidOne, sum: toNumberNullable(sum), totalRow, members, tripMembers}
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
        setMembersOfPayment,
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
    chooseMembersModalStyle: {
        width: 300,
    }
})
