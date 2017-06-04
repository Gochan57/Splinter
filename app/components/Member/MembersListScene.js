import React, {Component, PropTypes} from 'react'
import {ListView, View} from 'react-native'
import {ListItem} from 'react-native-material-ui'
import Icon from 'react-native-vector-icons/FontAwesome'
import {forEach} from 'lodash'

export default class MembersListScene extends Component {
    /**
     * members Список участников:
     *  [{
     *      personId: string || number,
     *      name: string,
     *      selected: bool
     *  }]
     * onFinish Закончить выбор участников.
     */
    static propTypes = {
        members: PropTypes.arrayOf(PropTypes.shape({
            personId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            selected: PropTypes.bool
        })),
        selectMember: PropTypes.func
    }

    /**
     * selectedMembers объект с полями id участников и булевскими значениями, выбран участник или нет
     *  {
     *      [personId: string || number]: bool
     *  }
     */
    constructor (props) {
        super(props)
        let selectedMembers = {}
        forEach(props.members, member => {
            selectedMembers[member.personId] = member.selected
        })
        
        this.state = {
            selectedMembers
        }
    }

    /**
     * Выбрать/убрать выбор с участика в списке.
     * @param personId Идентификатор участника.
     * @param value Выбран или нет true/false.
     */
    selectPerson = (personId, value) => {
        this.setState({
            selectedMembers: {
                ...this.state.selectedMembers,
                personId: value
            }
        })
    }

    /**
     * Рендерим одну строку в списке участников.
     * @param rowData Один элемент в массиве props.members.
     */
    renderRow = (rowData) => {
        const {personId} = rowData
        const selected = this.state.selectedMembers[personId]
        const color = selected ? '#3333ff' : '#e6e6e6'
        const check = (
            <Icon name={'check'} size={16} color={color}/>
        )
        return (
            <ListItem
                divider={true}
                onPress={() => {this.selectPerson(personId, !selected)}}
                rightElement={check}/>
        )
    }

    render () {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        const dataSource = ds.cloneWithRows(this.props.members)

        return <ListView
            dataSource={dataSource}
            renderRow={this.renderRow}/>
    }
}