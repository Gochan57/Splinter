import React, { Component } from 'react'
import { StyleSheet, TextInput, TouchableHighlight, View, Text } from 'react-native'
import {connect} from 'react-redux'
import { addTrip } from 'app/action/trips'
import {goTo} from 'app/route'
import TripsScene from './TripsScene'

class CreateNewTrip extends Component {

    propTypes: {
        navigator: React.propTypes.object,
    }

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            members: [],
            inputMember: '',
        }
    }

    _addTrip = () => {
        this.props.addTrip(this.state.name)
        goTo({
            navigator: this.props.navigator,
            component: TripsScene,
        })
    }

    componentWillMount () {
        // Задаем действие кнопке OK в navigation bar
        this.props.route.rightBtnAction = this._addTrip
    }

    render() {
        const {name, members, inputMember} = this.state
        const _members = members.map(member => (
            <Text>{member}</Text>
        ))
        return (
            <View>
                <View>
                    <Text>Введите наименование</Text>
                    <TextInput style={styles.input}
                        onChangeText={text => {this.setState({name: text})}}
                        value={name}
                    />
                </View>
                <View>
                    {members}
                    <TextInput
                        onChangeText={text => {this.setState({inputMember: text})}}
                        value={inputMember}
                    />
                    <TouchableHighlight onPress={() => {}}>
                        <Text>+</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'honeydew',
        height: 30
    }
})

export default connect(null, {addTrip})(CreateNewTrip)