import React, {Component, PropTypes} from 'react'
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

import PaymentsListItem from './PaymentsListItem'
import PaymentScene from './PaymentScene'

const styles =  appStyles.commonStyles

/**
 * Экран со списком счетов.
 */
class PaymentsListScene extends Component {

    // Отображается в строке навигатора
    static title = 'Новый счет'

    /**
     * @prop tripId Идентификатор путешествия.
     * @prop payments
     * [
     *    id, Идентификатор платежа
     *    name, Название платежа
     *    date, Дата платежа DD.MM.YYYY HH:MI:SS
     *    members: [{
     *        personId, Идентификатор участника
     *        spent, Потратил
     *        pay, Оплатил
     *        paidForAll, Платил за всех
     *    }]
     * ]
     * @prop navigator - Навигатор для перехода на другие экраны.
     */
    static propTypes = {
        tripId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        payments: PropTypes.array,
        navigator: PropTypes.object,
    }

    _toPaymentScene = () => {
        // FIXME tripId
        const {tripId} = this.props
        const passProps = {tripId}
        goTo({
            navigator: this.props.navigator,
            component: PaymentScene,
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
            const sum = members.reduce((s, v) => s + v.spent, 0)
            return (
                <PaymentsListItem key={id} id={id} name={name} date={date} sum={sum}/>
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
                <WideButton text={'Новый счет'} onPress={this._toPaymentScene} addBtn={true}/>
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
