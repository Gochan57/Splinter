import React, {Component} from 'react'
import {TouchableHighlight, View, Text} from 'react-native'
import {goTo} from 'app/components/Common/SNavigator'
import appStyles from 'app/styles'
import CreateNewTripScene from './CreateNewTripScene'

const styles = appStyles.addTripStyles

export default class AddTrip extends Component {

    propTypes: {
        route: React.propTypes.object,
        navigator: React.propTypes.object,
    }

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View>
                <TouchableHighlight onPress={this._onPress}>
                    <Text style={styles.row}>Add new trip</Text>
                </TouchableHighlight>
            </View>
        )
    }

    _onPress = () => {
        const {navigator} = this.props
        goTo({
            navigator,
            component: CreateNewTripScene,
            rightBtnOK: true
        })
    }
}