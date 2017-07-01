import React, {Component, PropTypes} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import moment from 'moment'
import {filter, some} from 'lodash'

import {toArrayWithKeys} from 'app/utils/utils'
import SNavigatorBar, {IconTypes, button} from 'app/components/Common/Navigator/SNavigatorBar'
import {goTo} from 'app/components/Common/Navigator/SNavigator'
import WideButton from 'app/components/Common/WideButton'
import appStyles from 'app/styles'

import PaymentsListItem from './PaymentsListItem'
import PaymentScene from './PaymentScene'

const styles =  appStyles.commonStyles

/**
 * Экран со списком счетов.
 */
class PaymentsListScene extends Component {

    // Отображается в строке навигатора по дефолту
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
        tripName: PropTypes.string,
        payments: PropTypes.array,
        navigator: PropTypes.object,
    }

    _toPaymentScene = (payment) => {
        const {tripId} = this.props
        const paymentId = payment && payment.id
        const passProps = {tripId, paymentId}
        goTo({
            navigator: this.props.navigator,
            component: PaymentScene,
            props: passProps,
        })
    }

    renderNavigatorBar = () => {
        const {navigator} = this.props
        const leftButton = button(IconTypes.back, () => {navigator.pop()})
        const title = this.props.tripName || PaymentsListScene.title
        return (
            <SNavigatorBar
                LeftButton={leftButton}
                Title={title}
            />
        )
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
        let _payments = payments
        // И сортируем в порядке убывания даты платежа
            .sort((p1, p2) => moment(p2.date, 'DD.MM.YYYY HH:MI').diff(moment(p1.date, 'DD.MM.YYYY HH:MI'), 'seconds'))
        const paymentsList = _payments.map(payment => {
            const {id, name, date, sum} = payment
            //const sum = members.reduce((s, v) => s + v.spent, 0)
            return (
                <PaymentsListItem
                    key={id}
                    tripId={this.props.tripId}
                    id={id}
                    name={name}
                    date={date}
                    sum={sum}
                    onPress={this._toPaymentScene.bind(this, payment)}
                    navigator={this.props.navigator}/>
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
                <View>
                    {this.renderNavigatorBar()}
                    {this.renderPaymentsList(payments)}
                </View>
                <WideButton text={'Новый счет'} onPress={this._toPaymentScene} addBtn={true}/>
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    // Текущее путешествие
    const trip = state.trips[ownProps.tripId]
    // Название путешествия
    const tripName = trip.name
    // Получаем список id счетов текущего путешествия.
    const paymentIds = trip.payments
    if (!paymentIds) {
        return {payments: null}
    }
    // Получаем список всех счетов.
    const allPayments = toArrayWithKeys(state.payments)
    // Выбираем из всех счетов те, которые входят в текущее путешествие.
    const payments = filter(allPayments, payment => paymentIds.indexOf(payment.id) > -1)
    return {tripName, payments}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsListScene)
