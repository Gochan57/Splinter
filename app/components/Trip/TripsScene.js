import React, {Component} from 'react'
import {View, Text, ListView} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {toArrayWithKeys} from 'app/utils/utils'
import {goTo} from 'app/components/Common/SNavigator'
import PaymentsScene from '../Payment/PaymentsScene';
import TripItem from './TripItem'
import AddTrip from './AddTrip'

class TripsScene extends Component {

    static title = 'Путешествия'

    /**
     * items - store.trips
     * navigator - Навигатор.
     */
    propTypes: {
        items: React.PropTypes.object,
        navigator: React.propTypes.object,
    }

    _toPaymentsScene = (tripId) => {
        const {items, navigator} = this.props
        const passProps = {
            tripId,
            payments: items[tripId].payments
        }
        console.log('passProps', passProps)
        console.log('tripId', tripId)
        console.log('items[tripId]', items[tripId])
        console.log('items[tripId].payments', items[tripId].payments)
        return () => {
            goTo({
                navigator,
                component: PaymentsScene,
                props: passProps,
                title: items[tripId].name
            })
        }
    }

    _renderTripItem = (rowData) => {
        return (
            <TripItem name={rowData.name} onPress={this._toPaymentsScene(rowData.id)}/>
        )
    }

    render(){
        const {items, navigator} = this.props

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        const rows = toArrayWithKeys(items)
        const dataSource = ds.cloneWithRows(rows)

        return (
            <View>
                <ListView
                    dataSource={dataSource}
                    renderRow={this._renderTripItem}
                />
                <AddTrip route={this.props.route} navigator={navigator}/>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    console.log('trips:', state.trips)
    return {items: state.trips}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TripsScene)
