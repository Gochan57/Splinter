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
import { addTrip, updateTrip } from 'app/action/trips'

import NavigatorBar, {IconType, button} from 'app/components/Common/Navigator/NavigatorBar'

import TripsListScene from './TripsListScene'
import {ITrip} from '../../models/trips';
import {IPerson} from '../../models/people';
import {formatValue} from '../../utils/utils';

const styles = appStyles.createNewTripStyles
const commonStyles = appStyles.commonStyles

/**
 * navigator Навигатор для переходов на другие экраны.
 * trip Редактируемое путешествие.
 */
interface IProps {
    navigator: NavigatorStatic,
    trip?: ITrip,
}

/**
 * addTrip Функция создания путешествия.
 * updateTrip Обновить путешествие.
 */
interface IStateProps {
    addTrip: (name: string, people: string[]) => void,
    updateTrip: (trip: ITrip) => void
}

/**
 * name Наименование путешествия.
 * people Массив имен участников.
 * inputMember Текст, вводимый в поле с добавлением нового участника.
 * inputtingNewMember В процессе ввода имени нового участника.
 */
interface IState {
    editMode: boolean,
    name: string,
    people: IPerson[],
    inputMember: string,
    inputtingNewMember: boolean
}

/**
 * Экран для просмотра/добавления/редактирования путешествия.
 */
class TripScene extends Component<IProps & IStateProps, IState> {

    constructor(props: IProps & IStateProps) {
        super(props)
        const {trip} = this.props
        this.state = {
            editMode: !!trip,
            name: trip ? trip.name : '',
            people: trip ? trip.people : [],
            inputMember: '',
            inputtingNewMember: false
        }
    }

    onConfirmButtonPress = () => {
        const {name, people} = this.state
        const {trip, navigator} = this.props
        if(trip) {
            this.props.updateTrip({...trip, name, people})
        }
        else {
            this.props.addTrip(name, people.map(person => person.name))
        }
        navigator.pop()
    }

    _addMember = () => {
        const {people, inputMember} = this.state
        const newPerson: IPerson = {
            id: 'NEW_PERSON',
            name: inputMember
        }
        this.setState({
            people: [...people, newPerson],
            inputMember: ''
        })
    }

    renderNavigatorBar = () => {
        const {navigator} = this.props
        const leftButton = button(IconType.BACK, () => {navigator.pop()})
        const rightButton = button(IconType.OK, this.onConfirmButtonPress)
        return (
            <NavigatorBar
                LeftButton={leftButton}
                Title={(this.state.editMode ? 'Редактирование' : 'Создание') + ' путешествия'}
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
                key={member.name}
                centerElement={member.name}/>
        ))
        _members.push(this.renderNewMemberRow())
        return (
            <View>
                {this.renderNavigatorBar()}
                <TextInput
                    onChangeText={text => {this.setState({name: text})}}
                    placeholder={'Название'}
                    value={this.state.name}
                    autoFocus={true}
                    style={commonStyles.wideInput}
                />
                {_members}
            </View>
        )
    }
}

export default connect(null, {addTrip, updateTrip})(TripScene)