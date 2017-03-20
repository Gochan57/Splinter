import React, { Component } from 'react'
import { StyleSheet, TextInput, TouchableHighlight, View, Text } from 'react-native'
import {connect} from 'react-redux'
import appStyles from 'app/styles'
import { addTrip } from 'app/action/trips'
import {goTo} from 'app/components/Common/SNavigator'
import TripsScene from './TripsScene'

const styles = appStyles.createNewTripStyles

class CreateNewTripScene extends Component {

    static title = 'Добавить путешествие'

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

    componentWillMount () {
        // Задаем действие кнопке OK в navigation bar
        this.props.route.rightBtnAction = this._addTrip
    }

    _addTrip = () => {
        const {name, members} = this.state
        const {navigator} = this.props
        this.props.addTrip(name, members)
        goTo({
            navigator,
            component: TripsScene,
        })
    }

    _addMember = () => {
        const {members, inputMember} = this.state
        this.setState({
            members: [...members, inputMember],
            inputMember: ''
        })
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
                    <TextInput style={styles.inputName}
                        onChangeText={text => {this.setState({name: text})}}
                        value={name}
                    />
                </View>
                <View>
                    {_members}
                    <TextInput style={styles.inputMember}
                        onChangeText={text => {this.setState({inputMember: text})}}
                        value={inputMember}
                    />
                    <TouchableHighlight onPress={this._addMember}>
                        <Text>+</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

export default connect(null, {addTrip})(CreateNewTripScene)