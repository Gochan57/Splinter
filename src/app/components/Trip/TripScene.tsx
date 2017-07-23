import React, { Component } from 'react'
import {
    TextInput,
    View,
    NavigatorStatic
} from 'react-native'
import {connect} from 'react-redux'
import {ListItem} from 'react-native-material-ui'
import Icon from 'react-native-vector-icons/FontAwesome'
import appStyles from 'app/styles'
import { addTrip } from 'app/action/trips'
import {goTo} from 'app/components/Common/Navigator/SNavigator'
import SNavigatorBar, {IconType, button} from 'app/components/Common/Navigator/SNavigatorBar'
import TripsListScene from './TripsListScene'

const styles = appStyles.createNewTripStyles
const commonStyles = appStyles.commonStyles

/**
 * navigator Навигатор для переходов на другие экраны.
 * addTrip Функция создания путешествия.
 */
interface IProps {
    navigator: NavigatorStatic,
    addTrip: (name: string, people: string[]) => void
}

/**
 * name Наименование путешествия.
 * people Массив имен участников.
 * inputMember Текст, вводимый в поле с добавлением нового участника.
 * inputtingNewMember В процессе ввода имени нового участника.
 */
interface IState {
    name: string,
    people: string[],
    inputMember: string,
    inputtingNewMember: boolean
}

/**
 * Экран для просмотра/добавления/редактирования путешествия.
 */
class TripScene extends Component<IProps, IState> {

    state: IState = {
        name: '',
        people: [],
        inputMember: '',
        inputtingNewMember: false
    }

    _addTrip = () => {
        const {name, people} = this.state
        const {navigator} = this.props
        this.props.addTrip(name, people)
        goTo(
            navigator,
            TripsListScene,
        )
    }

    _addMember = () => {
        const {people, inputMember} = this.state
        this.setState({
            people: [...people, inputMember],
            inputMember: ''
        })
    }

    renderNavigatorBar = () => {
        const {navigator} = this.props
        const leftButton = button(IconType.BACK, () => {navigator.pop()})
        const rightButton = button(IconType.OK, this._addTrip)
        return (
            <SNavigatorBar
                LeftButton={leftButton}
                Title={'Добавить путешествие'}
                RightButton={rightButton}
            />
        )
    }

    renderNewMemberRow = () => {
        const {inputtingNewMember, inputMember} = this.state
        const leftElement = (inputtingNewMember ? null : <Icon name='plus' size={16} color='black'/>)
        const textInputMember = (
            <TextInput
                autoFocus={true}
                style={styles.inputMember}
                value={inputMember}
                onChangeText={text => {this.setState({inputMember: text})}}
                onSubmitEditing={() => {
                    this._addMember()
                    this.setState({inputtingNewMember: false})
                }}
                placeholder={'Новый участник'}/>
        )
        const centerElement = (inputtingNewMember ? textInputMember : null)
        return (
            <ListItem
                key={'new_member'}
                leftElement={leftElement}
                onLeftElementPress={() => {this.setState({inputtingNewMember: true})}}
                centerElement={centerElement}
                divider={true}/>
        )
    }

    render() {
        const {people} = this.state
        let _members = people.map(member => (
            <ListItem
                key={member}
                centerElement={member}/>
        ))
        _members.push(this.renderNewMemberRow())
        return (
            <View>
                {this.renderNavigatorBar()}
                <View>
                    <TextInput
                        onChangeText={text => {this.setState({name: text})}}
                        placeholder={'Название'}
                        autoFocus={true}
                        style={commonStyles.wideInput}
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