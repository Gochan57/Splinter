import React, {Component} from 'react'
import {
    ListView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native'
import {ListItem} from 'react-native-material-ui'
import {
    ITrade,
    ITransfer
} from 'app/models/transfers'
import {dateToString} from '../../utils/utils';

/**
 * id Идентификатор расчета.
 * transfer Массив с информацией о передаче денег.
 * date Дата расчета.
 * divider Нужно ли рисовать разделитель.
 * onPress Действие при нажатии.
 */
interface IProps {
    transfer: ITransfer
    divider?: boolean,
    onPress?: () => void,
}

/**
 * Элемент в списке на экране со списком счетов.
 */
export default class PaymentSettleUpItem extends Component<IProps, null> {
    renderTransferRow(trade: ITrade) {
        const text = `${trade.fromPerson.name} ${String.fromCharCode(8594)} ${trade.toPerson.name}`
        return (
            <View style={styles.transferRowStyle}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.transferTextStyle}>{text}</Text>
                <View style={styles.transferCountStyle}><Text>{trade.count}</Text></View>
            </View>
        )
    }

    render() {
        const {transfer, divider, onPress} = this.props

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        const dataSource = ds.cloneWithRows(transfer.trades);

        const dividerBorder = divider ? {borderBottomWidth: 0.5, borderBottomColor: '#e0e0e0'} : null

        return (
            <View style={[styles.row, dividerBorder]}>
                <View style={styles.container}>
                    <View style={styles.leftContainer}>
                        <Text style={styles.titleText}>Расчёт</Text>
                        <Text style={styles.dateText}>{dateToString(transfer.date)}</Text>
                    </View>
                    <View style={styles.rightContainer}>
                        <ScrollView bounces={false}>
                        <ListView
                            style={{paddingBottom: 0, marginBottom: 0}}
                            dataSource={dataSource}
                            renderRow={this.renderTransferRow}
                            contentContainerStyle={styles.listViewContainer}/>
                        </ScrollView>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        height: 80
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
    },
    leftContainer: {
        flex: 2,
        justifyContent: 'center',
    },
    dateText: {
        color: '#757575',
        marginTop: 4
    },
    titleText: {
        fontSize: 16,
    },
    rightContainer: {
        flex: 3,
        paddingTop: 10,
        paddingBottom: 10,
    },
    listViewContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 0,
        marginBottom: 0
    },
    transferRowStyle: {
        flexDirection: 'row',
    },
    transferTextStyle: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    transferCountStyle: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',

    },
})
