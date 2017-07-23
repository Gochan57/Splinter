import React, {Component} from 'react'
import {ListView, View, StyleSheet, Text, TouchableHighlight} from 'react-native'
import {ListItem} from 'react-native-material-ui'
import Icon from 'react-native-vector-icons/FontAwesome'
import {filter, forEach} from 'lodash'

import NavigatorBar, {IconType, button} from 'app/components/Common/Navigator/NavigatorBar'

/**
 * members Список участников.
 * onFinish Закончить выбор участников.
 */
interface IProps {
    members: IMemberItem[],
    onFinish: (selectedMembers: string[]) => void
}

/**
 * personId Идентификатор участника счета.
 * name Имя, отображаемое в строке с участником счета.
 * selected Участвует ли в счете.
 */
export interface IMemberItem {
    personId: string,
    name: string,
    selected: boolean
}

/**
 * Выбранные для участия в счете люди.
 */
interface IState {
    selectedMembers: ISelectedMembers
}

interface ISelectedMembers {
    [personId: string]: boolean
}

/**
 * Компонент для выбора участников счета.
 */
export default class MembersListScene extends Component<IProps, IState> {
    /**
     * selectedMembers объект с полями id участников и булевскими значениями, выбран участник или нет
     *  {
     *      [personId: string || number]: bool
     *  }
     */
    constructor (props: IProps) {
        super(props)

        // Храним выбранных участников в стейте в selectedMembers
        let selectedMembers: ISelectedMembers = {}
        props.members.forEach(member => {
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
                [personId]: value
            }
        })
    }

    onFinish = () => {
        const {selectedMembers} = this.state
        const onlySelectedMembers: string[] = filter(Object.keys(selectedMembers), personId => selectedMembers[personId])
        this.props.onFinish(onlySelectedMembers)
    }

    /**
     * Рендерим заголовок окна
     */
    renderHeader = () => {
        const title = (<Text style={styles.headerText}>Выберите участников счета</Text>)
        const rightButton = button(IconType.OK, this.onFinish)
        return (
            <NavigatorBar
                Title={title}
                RightButton={rightButton}
            />
        )
    }

    /**
     * Рендерим одну строку в списке участников.
     * @param rowData Один элемент в массиве props.members.
     */
    renderRow = (rowData) => {
        const {personId, name} = rowData
        const selected: boolean = this.state.selectedMembers[personId]
        const onPress = () => {
            this.selectPerson(personId, !selected)
        }
        const color = selected ? '#3333ff' : '#e6e6e6'
        const check = (
            <TouchableHighlight onPress={onPress}>
                <Icon name={'check'} size={16} color={color}/>
            </TouchableHighlight>
        )
        return (
            <TouchableHighlight onPress={onPress}>
                <View>
                    <ListItem
                        divider={true}
                        centerElement={name}
                        rightElement={check}/>
                </View>
            </TouchableHighlight>
        )
    }

    render () {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        const dataSource = ds.cloneWithRows(this.props.members)

        return (
            <View>
                {this.renderHeader()}
                <View style={styles.container}>
                    <ListView
                        dataSource={dataSource}
                        renderRow={this.renderRow}/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderColor: '#E6E6E6'
    },
    headerText: {
        color: 'white',
        fontSize: 13,
    }
})