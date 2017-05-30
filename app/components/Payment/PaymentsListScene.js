import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import moment from 'moment'
import {filter, some} from 'lodash'

import {toArrayWithKeys} from 'app/utils/utils'
import {} from 'app/action/payments'
import {goTo} from 'app/components/Common/SNavigator'
import WideButton from 'app/components/Common/WideButton'
import appStyles from 'app/styles'

import PaymentItem from './PaymentItem'
import CreatePaymentScene from './PaymentScene'

const styles =  appStyles.commonStyles

class PaymentsListScene extends Component {

    // Отображается в строке навигатора
    static title = 'Новый счет'

    /**
     * @prop tripId Идентификатор путешествия.
     * @prop payments
     * {
     *  [id]: { Идентификатор платежа
     *      name, Название платежа
     *      date, Дата платежа DD.MM.YYYY HH:MI:SS
     *      members: [{ Участники
     *          personId, Идентификатор участника
     *          spent, Потратил
     *          pay Оплатил
     *      }]
     *  }
     * }
     * @prop navigator - Навигатор.
     */
    propTypes: {
        tripId: React.PropTypes.number,
        payments: React.PropTypes.object,
        navigator: React.propTypes.object,
    }

    _toCreatePaymentScene = () => {
        // FIXME tripId
        const {tripId} = this.props
        const passProps = {tripId}
        goTo({
            navigator: this.props.navigator,
            component: CreatePaymentScene,
            props: passProps,
            rightBtnOK: true,
            title: 'Новый счет'
        })
    }

    renderPaymentsList = (payments) => {
        if (!payments || !Object.keys(payments).length) {
            return (
                <View style={styles.infoTextContainer}>
                    <Text style={styles.infoText}>Пока нет ни одного счета</Text>
                </View>
            )
        }
        // Преобразуем payments из стора в массив
        let _payments = toArrayWithKeys(payments)
        // И сортируем в порядке убывания даты платежа
            .sort((p1, p2) => moment(p2.date, 'DD.MM.YYYY HH:MI').diff(moment(p1.date, 'DD.MM.YYYY HH:MI'), 'seconds'))
        const paymentsList = _payments.map(payment => {
            const {id, name, date, members} = payment
            const spent = members.reduce((s, v) => s + v.spent, 0)
            return (
                <PaymentItem key={id} id={id} name={name} date={date} spent={spent}/>
            )
        })
        return (
            <View>
                {paymentsList}
            </View>
        )
    }

    render() {
        const {payments} = this.props
        return (
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                {this.renderPaymentsList(payments)}
                <WideButton text={'Новый счет'} onPress={this._toCreatePaymentScene} addBtn={true}/>
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    // Получаем список id счетов текущего путешествия.
    const paymentIds = state.trips[ownProps.tripId].payments
    if (!paymentIds) {
        return {payments: null}
    }
    // Получаем список всех счетов.
    const allPayments = toArrayWithKeys(state.payments)
    // Выбираем из всех счетов те, которые входят в текущее путешествие.
    const payments = filter(allPayments, payment => paymentIds.indexOf(payment.id) > -1)
    return {payments}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsListScene)
