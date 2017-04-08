import React, { Component } from 'react'
import { StyleSheet, TextInput, TouchableHighlight, View, Text } from 'react-native'
import {connect} from 'react-redux'
import {ListItem} from 'react-native-material-ui'
import Icon from 'react-native-vector-icons/FontAwesome'
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
            inputNewMember: false
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

    renderNewMemberRow = () => {
        const {inputNewMember, inputMember} = this.state
        const leftElement = (inputNewMember ? null : <Icon name='plus' size={16} color='black'/>)
        const textInputMember = (
            <TextInput
                autoFocus={true}
                style={styles.inputMember}
                value={inputMember}
                onChangeText={text => {this.setState({inputMember: text})}}
                onSubmitEditing={() => {
                    this._addMember()
                    this.setState({inputNewMember: false})
                }}
                placeholder={'Новый участник'}/>
        )
        const centerElement = (inputNewMember ? textInputMember : null)
        return (
            <ListItem
                key={'new_member'}
                leftElement={leftElement}
                onLeftElementPress={() => {this.setState({inputNewMember: true})}}
                centerElement={centerElement}
                divider={true}/>
        )
    }

    render() {
        const {inputMember, members} = this.state
        let _members = members.map(member => (
            <ListItem
                key={member}
                centerElement={member}/>
        ))
        _members.push(this.renderNewMemberRow())
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
                </View>
            </View>
        )
    }
}

export default connect(null, {addTrip})(CreateNewTripScene)