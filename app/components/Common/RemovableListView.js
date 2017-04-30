import React, { Component, PropTypes } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import RemovableRow from './RemovableRow'

/**
 * ListView со строками, которые можно удалять свайпом влево или вправо.
 */
export default class RemovableListView extends Component {
    /**
     * data Массив с данными для строк. В каждом элементе обязательно поле key.
     * renderRow Функция, рисующая одну строку, принимает на вход один элемент массива data.
     * removeRow Функция, убирающая одну строку из данных, принимает на вход key.
     */
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]).isRequired,
            text: PropTypes.string
        })),
        renderRow: PropTypes.func,
        removeRow: PropTypes.func,
    }

    /**
     * Стиль одной строки по умолчанию.
     */
    defaultStyles = {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    }

    /**
     * Функция по умолчанию, рисующая строку.
     */
    defaultRenderRow = (rowData) => (
        <View style={this.defaultStyles}>
            <Text>{rowData.text}</Text>
        </View>
    )

    render() {
        const {data, renderRow = this.defaultRenderRow, removeRow} = this.props
        const list = data.map(elem => (
            <RemovableRow key={elem.key} removeRow={() => {removeRow(elem.key)}}>
                {renderRow(elem)}
            </RemovableRow>
        ))
        return (
            <View>
                {list}
            </View>
        )
    }
}

