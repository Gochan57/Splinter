import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableHighlight, SwipeableListView} from 'react-native'
import {filter} from 'lodash'

import WideInput from 'app/components/Common/WideInput'
import Switcher from 'app/components/Common/Switcher'
import RemovableListView from 'app/components/Common/RemovableListView'

import PaymentMember from './PaymentMemberView'

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
     * sum Общая сумма счета.
     */
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            spentEqually: false,
            paidOne: false,
            sum: null,
            data: [
                {key: 1, name: 'Юля', spent: 200},
                {key: 2, name: 'Вова', spent: 300},
                {key: 3, name: 'Гоша', spent: 150},
                {key: 4, name: 'Оля', spent: 128}
            ],
        }
    }

    renderMemberRow = (rowData) => (
        <PaymentMember
            name={rowData.name}
            spent={rowData.spent}
            key={rowData.key}/>
    )

    removeRow = (key) => {
        console.log(`removeRow(key: ${key})`)
        console.log('filtred: ', filter(this.state.data, elem => elem.key != key))
        this.setState({
            data: filter(this.state.data, elem => elem.key != key)
        })
    }

    render() {
        const data = this.state.data
        console.log('render data:', data)
        const {id} = this.props
        const {spentEqually, paidOne, sum} = this.state
        return (
            <View>
                <WideInput
                    placeholder='Название'
                    onChangeText={text => {this.setState({name: text})}}
                />
                <Switcher
                    label={'Потратили поровну'}
                    onValueChange={(value) => this.setState({spentEqually: value})}
                    value={spentEqually} />
                <Switcher
                    label={'Платил один'}
                    onValueChange={(value) => this.setState({paidOne: value})}
                    value={paidOne} />
                <WideInput
                    placeholder='Общая сумма счета'
                    onChangeText={value => {this.setState({sum: value})}}/>
                <RemovableListView
                    data={data}
                    renderRow={this.renderMemberRow}
                    removeRow={this.removeRow}/>
            </View>
        )
    }
}