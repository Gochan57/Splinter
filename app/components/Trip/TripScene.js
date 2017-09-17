import React, { Component } from 'react'
import { StyleSheet, TextInput, TouchableHighlight, View, Text } from 'react-native'
import {connect} from 'react-redux'
import {ListItem} from 'react-native-material-ui'
import Icon from 'react-native-vector-icons/FontAwesome'
import appStyles from 'app/styles'
import { addTrip } from 'app/action/trips'
import {goTo} from 'app/components/Common/Navigator/SNavigator'
import SNavigatorBar, {IconTypes, button} from 'app/components/Common/Navigator/SNavigatorBar'
import WideInput from 'app/components/Common/WideInput'
import TripsListScene from './TripsListScene'

const styles = appStyles.createNewTripStyles

/**
 * Экран для просмотра/добавления/редактирования путешествия.
 */
class TripScene extends Component {

    /**
     * navigator Навигатор для переходов на другие экраны.
     */
    static propTypes = {
        navigator: React.PropTypes.object,
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
            component: TripsListScene,
        })
    }

    _addMember = () => {
        const {members, inputMember} = this.state
        this.setState({
            members: [...members, inputMember],
            inputMember: ''
        })
    }

    renderNavigatorBar = () => {
        const {navigator} = this.props
        const leftButton = button(IconTypes.back, () => {navigator.pop()})
        const rightButton = button(IconTypes.OK, this._addTrip)
        return (
            <SNavigatorBar
                LeftButton={leftButton}
                Title={'Добавить путешествие'}
                RightButton={rightButton}
            />
        )
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
        const {members} = this.state
        let _members = members.map(member => (
            <ListItem
                key={member}
                centerElement={member}/>
        ))
        _members.push(this.renderNewMemberRow())
        return (
            <View>
                {this.renderNavigatorBar()}
                <View>
                    <WideInput
                        onChangeText={text => {this.setState({name: text})}}
                        placeholder={'Название'}
                        textInputProps={{autoFocus: true}}
                    />
                </View>
                <View>
                    {_members}
                </View>
            </View>
        )
    }
}

export default connect(null, {addTrip})(TripScene)