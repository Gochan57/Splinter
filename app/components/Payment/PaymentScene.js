import React, {Component} from 'react'
import {ActivityIndicator, StyleSheet, View, Text, TouchableHighlight, SwipeableListView} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {filter, find, forEach, pickBy} from 'lodash'

import {
    startCreatingNewPayment,
    startUpdatingPayment,
    spentEquallySwitched,
    paidOneSwitched,
    removeMemberFromPayment,
    changeMemberSpentOnPayment,
    updatePayment,
    cancelUpdatingPayment,
} from 'app/action/payments'
import {toArrayWithKeys} from 'app/utils/utils'
import {TEMPORARY_ID} from 'app/constants'

import WideInput from 'app/components/Common/WideInput'
import Switcher from 'app/components/Common/Switcher'
import RemovableListView from 'app/components/Common/RemovableListView'

import PaymentMemberView from './PaymentMemberView'

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

    renderMemberRow = (rowData) => (
        <PaymentMemberView
            name={rowData.name}
            spent={rowData.spent}
            paid={rowData.paid}
            spentEqually={rowData.spentEqually}
            paidOne={rowData.paidOne}
            onSpentChanged={value => {this.props.changeMemberSpentOnPayment(rowData.personId, value)}}
            onPaidChanged={()=>{}} //TODO
            radioButtonClass={'paidOne'}
            key={rowData.key}/>
    )

    render() {
        const {tripId, paymentId, loading, spentEqually, paidOne, sum, members} = this.props
        if (loading) {
            return <ActivityIndicator />
        }
        return (
            <View>
                <WideInput
                    placeholder='Название'
                    onChangeText={text => {this.setState({name: text})}}
                />
                <Switcher
                    label={'Потратили поровну'}
                    onValueChange={(value) => {this.props.spentEquallySwitched(value)}}
                    value={spentEqually} />
                <Switcher
                    label={'Платил один'}
                    onValueChange={(value) => {this.props.paidOneSwitched(value)}}
                    value={paidOne} />
                <WideInput
                    placeholder='Общая сумма счета'
                    onChangeText={value => {this.setState({sum: value})}}/>
                <RemovableListView
                    data={members}
                    renderRow={this.renderMemberRow}
                    removeRow={(personId) => this.props.removeMemberFromPayment(tripId, paymentId, personId)}/>
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const {tripId} = ownProps
    // Из списка всех счетов выберем счет с пометкой "новый".
    let payment = state.payments[TEMPORARY_ID]
    if(!payment) {
        return {loading: true}
    }
    // Добавим к каждому member поле key (этого требует элемент RemovableListView)
    forEach(payment.members, member => {
        member.key = member.personId
    })
    const {paymentId, name, spentEqually, paidOne, sum, members} = payment
    return {loading: false, tripId, paymentId, name, spentEqually, paidOne, sum, members}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        startCreatingNewPayment,
        startUpdatingPayment,
        spentEquallySwitched,
        paidOneSwitched,
        removeMemberFromPayment,
        changeMemberSpentOnPayment,
        updatePayment,
        cancelUpdatingPayment,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentScene)
