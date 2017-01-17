import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableHighlight, ListView} from 'react-native'
import TripItem from './TripItem'

export default class TripsList extends Component {
    constructor(props) {
        super(props)
    }

    propTypes: {
        items: React.PropTypes.array
    }

    _renderTripItem = (rowData, sectionId, rowId, higlightRow) => {
        return (
            <TouchableHighlight>
                <View style={styles.row}>
                    <Text style={styles.text}>
                        {rowData.name}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }

    render(){
        // const tripItems = this.props.items.map(item => <TripItem key={item.name} name={item.name}/>)
        const {items} = this.props
        return (
            <ListView
                dataSource={items}
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
