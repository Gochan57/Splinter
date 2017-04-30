import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, Text, TextInput, TouchableHighlight} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'


class PaymentMember extends Component {
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
    propTypes: {
        included: PropTypes.string.bool,
        name: PropTypes.string.isRequired,
        spent: PropTypes.number,
        paid: PropTypes.number,
        paidOne: PropTypes.bool,
        onSpentChanged: PropTypes.func.isRequired,
        onPaidChanged: PropTypes.func.isRequired,
        radioButtonClass: PropTypes.string.isRequired,
    }

    render() {

    }
}

const mapStateToProps = (state) => {
    return {items: state.trips}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TripsScene)
