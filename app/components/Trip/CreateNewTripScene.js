import React, { Component } from 'react'
import { StyleSheet, TextInput, TouchableHighlight, View, Text } from 'react-native'
import {ListItem} from 'react-native-material-ui'
import {connect} from 'react-redux'
import appStyles from 'app/styles'
import { addTrip } from 'app/action/trips'
import {goTo} from 'app/components/Common/SNavigator'
import WideInput from 'app/components/Common/WideInput'
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
        const {inputMember, members} = this.state
        const _members = members.map(member => (
            <ListItem
                key={member}
                centerElement={member}/>
        ))
        return (
            <View>
                <View>
                    <WideInput
                        onChangeText={text => {this.setState({name: text})}}
                        placeholder={'Название'}
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