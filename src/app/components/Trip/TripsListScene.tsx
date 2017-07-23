import React, {Component} from 'react'
import {
    View,
    ListView,
    NavigatorStatic
} from 'react-native'
import {connect} from 'react-redux'
import {toArrayWithKeys} from 'app/utils/utils'

import WideButton from 'app/components/Common/WideButton'
import NavigatorBar from 'app/components/Common/Navigator/NavigatorBar'
import PaymentsListScene from 'app/components/Payment/PaymentsListScene'

import TripScene from './TripScene'
import TripsListItem from './TripsListItem'
import {ITrip} from 'app/models/trips'
import {
    IStorable,
    IStore
} from 'app/models/common'

interface IProps {
    navigator: NavigatorStatic
}

interface IStateProps {
    trips: IStorable<ITrip>,
}

/**
 * Экран со списком путешествий.
 */
class TripsListScene extends Component<IProps & IStateProps, null> {
    _toPaymentsListScene = (tripId: string) => {
        const {navigator} = this.props
        return () => {
            navigator.push({component: PaymentsListScene, passProps: {tripId}})
        }
    }

    _toAddTripScene = () => {
        const {navigator} = this.props
        navigator.push({component: TripScene, passProps: {}})
    }

    renderNavigatorBar = () => {
        return (<NavigatorBar Title={'Путешествия'}/>)
    }

    _renderTripItem = (rowData: ITrip) => {
        return (
            <TripsListItem name={rowData.name} onPress={this._toPaymentsListScene(rowData.tripId)}/>
        )
    }

    render() {
        const {trips} = this.props

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        const rows: ITrip[] = toArrayWithKeys<ITrip>(trips)
        const dataSource = ds.cloneWithRows(rows)

        return (
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                {this.renderNavigatorBar()}
                <ListView
                    dataSource={dataSource}
                    renderRow={this._renderTripItem}
                />
                <WideButton text={'Новое путешествие'} onPress={this._toAddTripScene} addBtn={true}/>
            </View>
        )
    }
}

const mapStateToProps = (state: IStore): IStateProps => {
    return {trips: state.trips}
}

export default connect(mapStateToProps)(TripsListScene)