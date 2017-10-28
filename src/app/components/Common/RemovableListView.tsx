import React, {
    Component,
    ReactNode
} from 'react'
import {
    StyleSheet,
    Text,
    View
} from 'react-native'
import RemovableRow from './RemovableRow'

/**
 * data Массив с данными для строк. В каждом элементе обязательно поле key.
 * renderRow Функция, рисующая одну строку, принимает на вход один элемент массива data.
 * removeRow Функция, убирающая одну строку из данных, принимает на вход key.
 */
interface IProps {
    data: IRowData[],
    renderRow?: (rowData: IRowData) => ReactNode,
    removeRow: (key: string) => void,
}

/**
 * Данные для одной строки.
 * key Ключ строки. Обязателеный параметр.
 * text Текст, отображаемый в строке (используется в дефолтном рендере строки, если не передан renderRow).
 */
interface IRowData extends Object {
    key: string,
    text?: string
}

/**
 * ListView со строками, которые можно удалять свайпом влево или вправо.
 */
export default class RemovableListView extends Component<IProps, null> {
    /**
     * Функция по умолчанию, рисующая строку.
     */
    defaultRenderRow = (rowData) => (
        <View style={styles.row}>
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

const styles = StyleSheet.create({
    row: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    }

})
