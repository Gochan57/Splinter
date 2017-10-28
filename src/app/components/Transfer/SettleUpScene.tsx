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
} from 'app/models/transfers';
import {ListItem} from 'react-native-material-ui'

import {
    formatValue,
    toNumber
} from 'app/utils/utils';

import {IStore} from 'app/models/common';
import {objectify} from 'app/utils/objectify';
import * as transferThunks from 'app/thunk/transfers'

import {
    button,
    IconType,
    default as NavigatorBar
} from '../Common/Navigator/NavigatorBar';

import * as _ from 'lodash'
import {ITransferThunks} from 'app/thunk/transfers';

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

interface IDispatchProps extends ITransferThunks {}

interface IEditedTrade {
    count: number,
    willPay: boolean
}

/**
 * inputCounts Введенные данные о том, кто заплатил.
 */
interface IState {
    [tradeId: string]: IEditedTrade
}

/**
 * Экран с расчетом путешествия.
 */
class SettleUpScene extends Component<IProps & IStateProps & IDispatchProps, IState> {
    constructor(props: IProps & IStateProps & IDispatchProps) {
        super(props)

        let trades = {}
        props.settlingUp && props.settlingUp.trades && props.settlingUp.trades.forEach(trade => {
            trades[trade.id] = {
                count: trade.count,
                willPay: false
            }
        })

        this.state = trades
    }

    getTransferChain = (): ITrade[] => {
        if(!this.props.settlingUp) {
            return null
        }
        return _.filter(this.props.settlingUp.trades, (trade: ITrade) => {
            const editedTrade: IEditedTrade = this.state[trade.id]
            if(editedTrade.willPay) {
                trade.count = editedTrade.count
            }
            return editedTrade.willPay
        })
    }

    renderNavigatorBar = () => {
        const {navigator, tripId} = this.props
        const leftButton = button(IconType.BACK, () => {navigator.pop()})
        const title: string = this.props.tripName + ' - расчет'
        const rightButton = button(IconType.OK, () => {
            this.props.addTransferChain(tripId, this.getTransferChain())
            this.props.navigator.pop()
        })
        return (
            <NavigatorBar
                LeftButton={leftButton}
                Title={title}
                RightButton={rightButton}
            />
        )
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
                <View style={styles.verticalCenter}>
                    <TextInput
                        placeholder='Отдал'
                        onChangeText={this.onChangeCount(tradeId)}
                        value={formatValue(trade.count)}
                        style={styles.input}
                    />
                </View>
                <TouchableHighlight onPress={this.onToggleWillPay(tradeId)} style={styles.verticalCenter}>
                    <Icon name={'check'} size={16} color={color}/>
                </TouchableHighlight>
            </View>
        )
    }

    render() {
        const rows = this.props.settlingUp ? this.props.settlingUp.trades.map(this.rowItem) : null
        return (
            <View>
                {this.renderNavigatorBar()}
                {rows}
            </View>
        )
    }
}

const mapStateToProps = (state: IStore, ownProps: IProps): IStateProps => {
    const trip = objectify.trip(state, state.trips.items[ownProps.tripId])

    return {
        tripName: trip.name,
        settlingUp: trip.settlingUp
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({...transferThunks}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SettleUpScene)

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    verticalCenter: {
        justifyContent: 'center'
    },
    input: {
        height: 40,
        width: 100
    },
})

