import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, Text, TextInput, TouchableHighlight} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {removeMemberFromPayment} from 'app/action/payments'
import PaymentMemberView from './PaymentMemberView'

class PaymentMember extends Component {
    /**
     * id Идентификатор участника счета.
     * included Участвует в счете.
     * name Имя участника.
     * spent Потратил денег.
     * paid Оплатил денег.
     * paidOne Платил только этот участник.
     * onSpentChanged Коллбэк на изменение значения потраченных денег.
     * onPaidChanged Коллбэк на изменение значения оплаченных денег.
     */
    static propTypes = {
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        included: PropTypes.bool,
        name: PropTypes.string.isRequired,
        spent: PropTypes.number,
        paid: PropTypes.number,
        paidOne: PropTypes.bool,
        onSpentChanged: PropTypes.func.isRequired,
        onPaidChanged: PropTypes.func.isRequired,
    }

    render() {
        const {included, name, spent, paid, paidOne, onSpentChanged, onPaidChanged} = this.props
        return (
            <PaymentMemberView
                included={included}
                name={name}
                spent={spent}
                paid={paid}
                paidOne={paidOne}
                onSpentChanged={onSpentChanged}
                onPaidChanged={onPaidChanged}/>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({removeMemberFromPayment}, dispatch)
}

export default connect(null, mapDispatchToProps)(PaymentMember)
