import React, {Component} from 'react'
import {View, Text, ListView} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {toArrayWithIds} from 'app/utils/utils'
import {goTo} from 'app/components/Common/SNavigator'
import TripItem from './TripItem'
import AddTrip from './AddTrip'
import {test} from 'app/action/trips'

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

    _toPaymentsList = (tripId) => {
        const {items, navigator} = this.props
        passProps = {
            name: tripId
        }
        return () => {
            goTo({
                navigator,
                component: TripItem,
                props: passProps,
                title: items[tripId].name
            })
        }
    }

    _renderTripItem = (rowData) => {
        return (
            <TripItem name={rowData.name} onPress={this._toPaymentsList(rowData.id)}/>
        )
    }

    componentWillMount () {
        this.props.test('hello')
    }

    render(){
        const {items, navigator} = this.props

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        const rows = toArrayWithIds(items)
        const dataSource = ds.cloneWithRows(rows)

        return (
            <View>
                <ListView
                    dataSource={dataSource}
                    renderRow={this._renderTripItem}
                />
                <AddTrip route={this.props.route} navigator={navigator}/>
                <Text>{items.test}</Text>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    console.log('trips:', state.trips)
    return {items: state.trips}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({test}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TripsScene)
