import React, {Component} from 'react'
import {StyleSheet, View, Text, ListView} from 'react-native'
import TripItem from './TripItem'
import AddTrip from './AddTrip'

export default class TripsScene extends Component {
    constructor(props) {
        super(props)
    }

    propTypes: {
        items: React.PropTypes.array,
    }

    _toPaymentsList = (tripId) => {
        return () => {this.props.navigator.push({
            component: TripItem,
            passProps: {
                name: tripId
            }
        })}
    }

    _renderTripItem = (rowData) => {
        return (
            <TripItem name={rowData.name} onPress={this._toPaymentsList(rowData.id)}/>
        )
    }

    render(){
        const {items} = this.props

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dataSource = ds.cloneWithRows(items)

        return (
            <ListView
                dataSource={dataSource}
                renderRow={this._renderTripItem}
            />
        )
    }
}

var styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#F6F6F6',
    },
    thumb: {
        width: 64,
        height: 64,
    },
    text: {
        flex: 1,
    },
});

// <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
// {tripItems}
// </View>
