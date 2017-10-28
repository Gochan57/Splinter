import React, {Component} from 'react'
import {
    View,
    ListView,
    NavigatorStatic
} from 'react-native'
import {connect} from 'react-redux'

import WideButton from 'app/components/Common/WideButton'
import NavigatorBar from 'app/components/Common/Navigator/NavigatorBar'
import PaymentsListScene from 'app/components/Payment/PaymentsListScene'

import TripScene from './TripScene'
import TripsListItem from './TripsListItem'
import {
    IStoreTrip,
    ITrip,
    ITripActions
} from 'app/models/trips'
import {
    IStorable,
    IStore
} from 'app/models/common'
import {
    objectify,
    storify
} from 'app/utils/objectify';

import * as _ from 'lodash'
import {bindActionCreators} from 'redux';
import * as tripThunks from 'app/thunk/trips';
import {ITripThunks} from 'app/thunk/trips';

interface IProps {
    navigator: NavigatorStatic
}

interface IStateProps {
    trips: ITrip[],
}

interface IDispatchProps extends ITripThunks {}

/**
 * Экран со списком путешествий.
 */
class TripsListScene extends Component<IProps & IStateProps & IDispatchProps, null> {
    _toPaymentsListScene = (trip: ITrip) => {
        const {navigator} = this.props
        return () => {
            this.props.setCurrentTrip(storify.trip(trip))
            navigator.push({component: PaymentsListScene, passProps: {tripId: trip.id}})
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
            <TripsListItem name={rowData.name} onPress={this._toPaymentsListScene(rowData)}/>
        )
    }

    render() {
        const {trips} = this.props

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        const dataSource = ds.cloneWithRows(trips)

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
    const storeTrips = _.values<IStoreTrip>(state.trips)
    return {trips: storeTrips.map(storeTrip => objectify.trip(state, storeTrip))}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({...tripThunks}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TripsListScene)
