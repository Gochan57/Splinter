import React, { Component } from 'react'
import { TextInput, TouchableHighlight, View, Text } from 'react-native'
import { addTrip }from 'app/action/trips'

export default class CreateNewTrip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            members: [],
            inputMember: '',
        }
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
                    <TextInput
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
                    <TouchableHighlight onPress={addTrip(inputMember)}>
                        <Text>+</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}