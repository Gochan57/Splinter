import React, {Component} from 'react'
import {
    View,
    Text,
    NavigatorStatic
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import moment from 'moment'
import {filter, some} from 'lodash'

import {toArrayWithKeys} from 'app/utils/utils'
import NavigatorBar, {IconType, button} from 'app/components/Common/Navigator/NavigatorBar'
import WideButton from 'app/components/Common/WideButton'
import appStyles from 'app/styles'

import PaymentsListItem from './PaymentsListItem'
import PaymentScene from './PaymentScene'
import {IPayment} from 'app/models/payments'
import {IStore} from 'app/models/common'
import {ITrip} from 'app/models/trips'

const styles =  appStyles.commonStyles

/**
 * navigator - Навигатор для перехода на другие экраны.
 * tripId Идентификатор путешествия.
 */
interface IProps {
    navigator: NavigatorStatic,
    tripId: string,
}

/**
 * tripName Наименование путешествия.
 * payments Список счетов.
 */
interface IStateProps {
    tripName: string,
    payments: IPayment[],
}

/**
 * Экран со списком счетов.
 */
class PaymentsListScene extends Component<IProps & IStateProps, null> {
    /**
     * Переход на экран редактирования счета.
     * Если payment не передается, то откроется экран создания нового счета.
     */
    _toPaymentScene = (payment?: IPayment) => {
        const {tripId} = this.props
        const paymentId: string = payment && payment.paymentId
        // FIXME props
        const passProps = {tripId, paymentId}
        this.props.navigator.push({component: PaymentScene, passProps})
    }

    renderNavigatorBar = () => {
        const {navigator} = this.props
        const leftButton = button(IconType.BACK, () => {navigator.pop()})
        const title: string = this.props.tripName || 'Новый счет'
        return (
            <NavigatorBar
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
        // Сортируем в порядке убывания даты платежа
        let _payments: IPayment[] = payments
            .sort((p1, p2) => moment(p2.date, 'DD.MM.YYYY HH:MI').diff(moment(p1.date, 'DD.MM.YYYY HH:MI'), 'seconds'))

        const paymentsList = _payments.map(payment => {
            const {paymentId, name, date, sum} = payment
            return (
                <PaymentsListItem
                    key={paymentId}
                    tripId={this.props.tripId}
                    id={paymentId}
                    name={name}
                    date={date}
                    sum={sum}
                    onPress={this._toPaymentScene.bind(this, payment)}/>
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

const mapStateToProps = (state: IStore, ownProps: IProps) => {
    // Текущее путешествие
    const trip: ITrip = state.trips[ownProps.tripId]
    // Название путешествия
    const tripName: string = trip.name
    // Получаем список id счетов текущего путешествия.
    const paymentIds: string[] = trip.payments
    if (!paymentIds) {
        return {payments: null}
    }
    // Получаем список всех счетов.
    const allPayments: IPayment[] = toArrayWithKeys<IPayment>(state.payments)
    // Выбираем из всех счетов те, которые входят в текущее путешествие.
    const payments: IPayment[] = filter(allPayments, payment => paymentIds.indexOf(payment.id) > -1)
    return {tripName, payments}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsListScene)
