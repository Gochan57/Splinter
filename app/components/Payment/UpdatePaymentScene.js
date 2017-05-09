import React, {Component} from 'react'
import {ActivityIndicator, StyleSheet, View, Text, TouchableHighlight, SwipeableListView} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {filter, find, forEach, pickBy} from 'lodash'

import {removeMemberFromPayment} from 'app/action/payments'
import {toArrayWithKeys} from 'app/utils/utils'

import WideInput from 'app/components/Common/WideInput'
import Switcher from 'app/components/Common/Switcher'
import RemovableListView from 'app/components/Common/RemovableListView'

import PaymentMemberView from './PaymentMemberView'

class UpdatePaymentScene extends Component {

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

    renderMemberRow = (rowData) => (
        <PaymentMemberView
            name={rowData.name}
            spent={rowData.spent}
            onSpentChanged={()=>{}} //TODO
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
                    onValueChange={(value) => this.setState({spentEqually: value})}
                    value={spentEqually} />
                <Switcher
                    label={'Платил один'}
                    onValueChange={(value) => this.setState({paidOne: value})}
                    value={paidOne} />
                <WideInput
                    placeholder='Общая сумма счета'
                    onChangeText={value => {this.setState({sum: value})}}/>
                <RemovableListView
                    data={members}
                    renderRow={this.renderMemberRow}
                    removeRow={(memberId) => this.props.removeMemberFromPayment(tripId, paymentId, memberId)}/>
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const {tripId} = ownProps
    // Из списка всех счетов выберем счет с пометкой "новый".
    let newPayment
    let newPaymentId
    const paymentIds = Object.keys(state.payments)
    for(let i = 0; i<paymentIds.length; i++) {
        const paymentId = paymentIds[i]
        if (state.payments[paymentId].isNewPayment) {
            newPaymentId = paymentId
            newPayment = state.payments[paymentId]
            break
        }
    }
    // Новый счет добавляется в общий список счетов, id для которого запрашивается в базе.
    // TODO подумать, может id создавать во время сохранения счета?
    if(!newPayment) {
        return {loading: true}
    }
    let members = newPayment.members
    forEach(members, member => {
        member.key = member.personId
    })
    return {loading: false, paymentId: newPaymentId, members}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({removeMemberFromPayment}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePaymentScene)
