import React, {Component} from 'react'
import {
    View,
    Text,
    NavigatorStatic,
    TextInput,
    TouchableHighlight,
    StyleSheet,
} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import Icon from 'react-native-vector-icons/FontAwesome'

import {
    ISettlingUp,
    ITrade,
    ITransfer
} from 'app/models/transfers';
import {ListItem} from 'react-native-material-ui'
import {
    formatValue,
    toNumber
} from 'app/utils/utils';
import {IStore} from '../../models/common';
import {objectifyTrip} from '../../utils/objectify';

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
 * settlingUp Расчет путешествия.
 */
interface IStateProps {
    tripName: string,
    settlingUp: ISettlingUp,
}

/**
 * inputCounts Введенные данные о том, кто заплатил.
 */
interface IState {
    [tradeId: string]: {
        count: number,
        willPay: boolean
    }
}

/**
 * Экран с расчетом путешествия.
 */
class SettleUpScene extends Component<IProps & IStateProps, IState> {
    constructor(props: IProps & IStateProps) {
        super(props)

        let trades = {}
        props.settlingUp.trades && props.settlingUp.trades.forEach(trade => {
            trades[trade.id] = {
                count: trade.count,
                willPay: false
            }
        })

        this.state = trades
    }

    rowItem = (trade: ITrade) => {
        const text = `${trade.fromPerson.name} ${String.fromCharCode(8594)} ${trade.toPerson.name}`
        return (
            <ListItem
                key={trade.id}
                centerElement={{primaryText: text}}
                rightElement={this.rightItemElement(trade.id)}
                onPress={() => {}}
                divider={true}/>
        )
    }

    onChangeCount = (tradeId: string) => (count: string) => {
        const trade = this.state[tradeId]
        this.setState({
            [tradeId]: {
                ...trade,
                count: toNumber(count)
            }
        })
    }

    onToggleWillPay = (tradeId: string) => () => {
        const trade = this.state[tradeId]
        debugger
        this.setState({
            [tradeId]: {
                ...trade,
                willPay: !trade.willPay
            }
        })}

    rightItemElement = (tradeId: string) => {
        const trade = this.state[tradeId]
        const color = trade.willPay ? '#3333ff' : '#e6e6e6'
        return (
            <View style={styles.rowContainer}>
                <TextInput
                    placeholder='Отдал'
                    onChangeText={this.onChangeCount(tradeId)}
                    value={formatValue(trade.count)}
                    style={styles.input}
                />
                <TouchableHighlight onPress={this.onToggleWillPay(tradeId)}>
                    <Icon name={'check'} size={16} color={color}/>
                </TouchableHighlight>
            </View>
        )
    }

    render() {
        const rows = this.props.settlingUp.trades.map(this.rowItem)
        return (
            <View>
                {rows}
            </View>
        )
    }
}

const mapStateToProps = (state: IStore, ownProps: IProps): IStateProps => {
    const trip = objectifyTrip(state, state.trips[ownProps.tripId])

    return {
        tripName: trip.name,
        settlingUp: trip.settlingUp
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SettleUpScene)

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row'
    },
    input: {
        height: 40,
        width: 100
    }
})

