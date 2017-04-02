import React, {Component} from 'react'
import {View, Text, TouchableHighlight} from 'react-native'
import {ListItem} from 'react-native-material-ui'
import appStyles from 'app/styles'

const styles = appStyles.tripItemStyles

export default class TripItem extends Component {

    static title = 'Счета'

    constructor(props) {
        super(props)
    }

    propTypes: {
        name: React.PropTypes.string,
        onPress: React.PropTypes.func,
    }

    render() {
        const {name, onPress} = this.props
        return (
            <ListItem
                divider={true}
                centerElement={name}
                onPress={onPress}/>
            //<TouchableHighlight onPress={onPress}>
            //    <View style={styles.row}>
            //        <Text style={styles.text}>
            //            {name}
            //        </Text>
            //    </View>
            //</TouchableHighlight>
        )
    }
}