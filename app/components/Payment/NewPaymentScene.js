import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableHighlight, SwipeableListView} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {filter, forEach} from 'lodash'

import {removeMemberFromNewPayment} from 'app/action/payments'
import {toArrayWithKeys} from 'app/utils/utils'

import WideInput from 'app/components/Common/WideInput'
import Switcher from 'app/components/Common/Switcher'
import RemovableListView from 'app/components/Common/RemovableListView'

import PaymentMemberView from './PaymentMemberView'

class NewPaymentScene extends Component {

    /**
     * Заголовок сцены для строки навигатора.
     */
    static title = 'Новый счет'

    /**
     * tripId Идентификатор путешествия.
     */
    static propTypes = {
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
        <PaymentMemberView
            name={rowData.name}
            spent={rowData.spent}
            onSpentChanged={()=>{}} //TODO
            onPaidChanged={()=>{}} //TODO
            radioButtonClass={'paidOne'}
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
        //const data = this.state.data
        const data = this.props.members
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
                    removeRow={(key) => this.props.removeMemberFromNewPayment(key)}/>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    console.log('---> mapStateToProps', state)
    const newPayment = state.payments.newPayment
    const people = state.trips[newPayment.tripId].people
    let members = toArrayWithKeys(newPayment.members, 'key')
    forEach(members, member => {
        member.name = people[member.key].name
    })
    return {members}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({removeMemberFromNewPayment}, dispatch)
}

//const mapDispatchToProps = (dispatch) => ({
//    removeMemberFromNewPayment(id) {
//        dispatch(removeMemberFromNewPayment(id))
//    },
//})

export default connect(mapStateToProps, mapDispatchToProps)(NewPaymentScene)
