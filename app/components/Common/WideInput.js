import React, {Component, PropTypes} from 'react'
import {View, TextInput} from 'react-native'
import appStyles from 'app/styles'

const styles = appStyles.commonStyles

/**
 * Компонент инпута на всю ширину экрана.
 */
export default class WideInput extends Component {
    /**
     * onChangeText Коллбэк на изменение текста.
     * placeholder Подсказка, отображающаяся при отстуствии значения в инпуте.
     * value Текст в инпуте (передается, если текст нужно спустить сверху).
     * textInputProps Свойства компонента TextInput.
     */
    static propTypes = {
        onChangeText: PropTypes.func.isRequired,
        placeholder: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        textInputProps: PropTypes.object,
    }

    render() {
        const {onChangeText, placeholder, textInputProps, value} = this.props
        return (
            <View>
                <TextInput
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    value={value !== undefined ? value.toString() : undefined}
                    style={styles.wideInput}
                    {...textInputProps}/>
            </View>
        )
    }
}