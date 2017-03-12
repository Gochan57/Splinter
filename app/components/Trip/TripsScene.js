import React, {Component} from 'react'
import {StyleSheet, View, Text, ListView} from 'react-native'
import {connect} from 'react-redux'
import {toArrayWithIds} from 'app/utils/utils'
import {goTo} from 'app/route'
import TripItem from './TripItem'
import AddTrip from './AddTrip'

class TripsScene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: 'Путешествия'
        }
    }

    propTypes: {
        items: React.PropTypes.object,
        navigator: React.propTypes.object,
    }

    _toPaymentsList = (tripId) => {
        const {items, navigator} = this.props
        const {title} = this.state
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
        console.log('TripsScene route:', this.props.route)
    }

    componentWillUpdate () {
        console.log('TripsScene will update...')
        console.log('updated trips:', this.props.items)
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
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    console.log('trips:', state.trips)
    return {items: state.trips}
}

export default connect(mapStateToProps, null)(TripsScene)
