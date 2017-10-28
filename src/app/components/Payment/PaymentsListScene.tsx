import React, {Component} from 'react'
import {
    View,
    Text,
    NavigatorStatic,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import moment from 'moment'

import NavigatorBar, {IconType, button} from 'app/components/Common/Navigator/NavigatorBar'
import WideButton from 'app/components/Common/WideButton'
import appStyles from 'app/styles'
import {tripActions} from 'app/action/trips';
import {objectify} from 'app/utils/objectify';
import {IPayment} from 'app/models/payments'
import {IStore} from 'app/models/common'
import {
    ITrip,
    ITripActions
} from 'app/models/trips'
import {ITransfer} from 'app/models/transfers'

import PaymentsListItem from './PaymentsListItem'
import PaymentScene from './PaymentScene'
import PaymentSettleUpItem from './PaymentSettleUpItem'
import SettleUpScene from '../Transfer/SettleUpScene'
import TripScene from '../Trip/TripScene'
import ModalMenu, {IModalMenuButton} from '../Common/ModalMenu'

import * as _ from 'lodash'

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
    trip: ITrip
}

interface IDispatchProps extends ITripActions {}

/**
 * menuIsOpened Открыто всплывающее окно меню.
 */
interface IState {
    menuIsOpened: boolean
}

/**
 * Экран со списком счетов.
 */
class PaymentsListScene extends Component<IProps & IStateProps & IDispatchProps, IState> {

    state: IState = {
        menuIsOpened: false
    }

    /**
     * Переход на экран редактирования счета.
     * Если payment не передается, то откроется экран создания нового счета.
     */
    _toPaymentScene = (payment?: IPayment) => {
        const {tripId} = this.props
        const paymentId: string = payment && payment.id
        const passProps = {tripId, paymentId}
        this.props.navigator.push({component: PaymentScene, passProps})
    }

    toEditTripScene = () => {
        this.toggleMenuWindow(false)
        const passProps = {trip: this.props.trip}
        this.props.navigator.push({component: TripScene, passProps})
    }

    settleUpButtonPress = () => {
        const {settleUp, tripId} = this.props
        // FIXME когда появится реализация от Юли
        // this.props.settleUp(tripId)
        this.toSettleUpScene()
    }

    toSettleUpScene = () => {
        this.toggleMenuWindow(false)
        const passProps = {tripId: this.props.tripId}
        this.props.navigator.push({component: SettleUpScene, passProps})
    }

    toggleMenuWindow = (menuIsOpened: boolean) => {
        this.setState({menuIsOpened})
    }

    renderMenuModal = () => {
        const buttons: IModalMenuButton[] = [
            {text: 'Редактировать', onPress: this.toEditTripScene},
            {text: 'Рассчитать', onPress: this.settleUpButtonPress},
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
        const title: string = this.props.trip.name || 'Новый счет'
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
            const {id, name, date, sum} = payment
            return (
                <PaymentsListItem
                    key={id}
                    tripId={this.props.tripId}
                    id={id}
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
        const {payments, transfers} = this.props.trip
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
    return {trip: objectify.trip(state, state.trips[ownProps.tripId])}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(tripActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsListScene)
