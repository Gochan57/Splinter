import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native'
import {ListItem} from 'react-native-material-ui'

import WideInput from 'app/components/Common/WideInput'
import Switcher from 'app/components/Common/Switcher'

export default class CreatePaymentScene extends Component {
    /**
     * tripId Идентификатор путешествия.
     */
    propTypes: {
        tripId: React.PropTypes.string,
    }

    /**
     * name Название счета.
     * spentEqually Потратили одинаково?
     * paidOne Платил один?
     */
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            spentEqually: false,
            paidOne: false
        }
    }

    render() {
        const {id, name, date, spent} = this.props
        return (
            <View>
                <WideInput
                    placeholder='Название'
                    onChangeText={text => {this.setState({name: text})}}
                />
                <Switcher
                    label={'Потратили поровну'}
                    onValueChange={(value) => this.setState({spentEqually: value})}
                    value={this.state.spentEqually} />
            </View>
        )
    }
}