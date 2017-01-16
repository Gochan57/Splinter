import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import TripItem from './TripItem'

export default class TripList extends Component {
    constructor(props) {
        super(props)
    }

    propTypes: {
        items: React.PropTypes.array
    }

    render(){
        const tripItems = this.props.items.map(item => <TripItem key={item.name} name={item.name}/>)
        return (
            <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                {tripItems}
            </View>
        )
    }
}