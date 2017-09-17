import React, {Component} from 'react'
import {
    View,
    Text,
    NavigatorStatic,
    Modal,
    TouchableHighlight
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
import {
    IPayment,
} from 'app/models/payments'
import {IStore} from 'app/models/common'
import {ITrip} from 'app/models/trips'
import ModalMenu, {IModalMenuButton} from '../Common/ModalMenu'
import PaymentSettleUpItem from './PaymentSettleUpItem'
import {
    ITrade,
    ITransfer
} from 'app/models/transfers'

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
 * transfers Список расчетов.
 */
interface IStateProps {
    tripName: string,
    payments: IPayment[],
    transfers: ITransfer[]
}

/**
 * menuIsOpened Открыто всплывающее окно меню.
 */
interface IState {
    menuIsOpened: boolean
}

/**
 * Экран со списком счетов.
 */
class PaymentsListScene extends Component<IProps & IStateProps, IState> {

    state: IState = {
        menuIsOpened: false
    }

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

    toggleMenuWindow = (menuIsOpened: boolean) => {
        this.setState({menuIsOpened})
    }

    renderMenuModal = () => {
        const buttons: IModalMenuButton[] = [
            {text: 'Редактировать', onPress: () => {}},
            {text: 'Рассчитать', onPress: () => {}},
        ]
        return (
            <ModalMenu
                title='Выберите действие'
                buttons={buttons}
                isOpened={this.state.menuIsOpened}
                closeModal={() => {this.toggleMenuWindow(false)}}
            />
        )
    }

    renderNavigatorBar = () => {
        const {navigator} = this.props
        const leftButton = button(IconType.BACK, () => {navigator.pop()})
        const title: string = this.props.tripName || 'Новый счет'
        const rightButton = button(IconType.MENU, () => {this.toggleMenuWindow(true)})
        return (
            <NavigatorBar
                LeftButton={leftButton}
                Title={title}
                RightButton={rightButton}
            />
        )
    }

    renderList = (payments: IPayment[], transfers: ITransfer[]) => {
        if (!payments.length && !transfers.length) {
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
        // Сортируем в порядке убывания даты платежа
        let _transfers: ITransfer[] = transfers
            .sort((p1, p2) => moment(p2.date, 'DD.MM.YYYY HH:MI').diff(moment(p1.date, 'DD.MM.YYYY HH:MI'), 'seconds'))

        const transfersList = _transfers.map(transfer =>
            <PaymentSettleUpItem
                transfer={transfer}
                divider={true}/>
        )
        return (
            <View>
                {paymentsList}
                {transfersList}
            </View>
        )
    }

    render() {
        const {payments, transfers} = this.props
        return (
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <View>
                    {this.renderNavigatorBar()}
                    {this.renderList(payments, transfers)}
                </View>
                <WideButton text={'Новый счет'} onPress={this._toPaymentScene} addBtn={true}/>
                {this.renderMenuModal()}
            </View>
        )
    }
}

const mapStateToProps = (state: IStore, ownProps: IProps): IStateProps => {
    // Текущее путешествие
    const trip: ITrip = state.trips[ownProps.tripId]
    // Название путешествия
    const tripName: string = trip.name

    // Получаем список id счетов текущего путешествия.
    const paymentIds: string[] = trip.payments
    // Получаем список всех счетов.
    const allPayments: IPayment[] = toArrayWithKeys<IPayment>(state.payments)
    // Выбираем из всех счетов те, которые входят в текущее путешествие.
    const payments: IPayment[] = filter(allPayments, payment => paymentIds.indexOf(payment.id) > -1)


    // Получаем список id расчетов текущего путешествия.
    const transferIds: string[] = trip.transfers
    // Список всех расчётов.
    const allTransfers: ITransfer[] = toArrayWithKeys<ITransfer>(state.transfers)
    // Выбираем из всех счетов те, которые входят в текущее путешествие.
    const transfers: ITransfer[] = filter(allTransfers, transfer => transferIds.indexOf(transfer.id) > -1)

    return {tripName, payments, transfers}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsListScene)
